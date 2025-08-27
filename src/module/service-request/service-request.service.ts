import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto'; 
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { ServiceRequest, Prisma, UserType } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import { FilterServiceRequestsDto } from './dto/filter-service-requests.dto';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly mailerService: MailerService,
  ) { }

  /**
   * Cria uma nova solicitação de serviço no sistema, com base nos dados
   * enviados por uma pessoa normal ou uma empresa.
   * Envia um e-mail de confirmação ao solicitante.
   * @param createServiceRequestDto DTO com os dados da solicitação.
   * @returns A solicitação de serviço criada e uma mensagem de sucesso.
   * @throws BadRequestException se o e-mail não for fornecido.
   */
  async create(createServiceRequestDto: CreateServiceRequestDto) {
    const {
      requesterType,
      requesterEmail,
      requesterPhoneNumber,
      individualRequesterName,
      individualIdentityNumber,
      individualAddress,
      individualUserId,
      companyRequesterName,
      companyNif,
      companyAddress,
      companyDistrictId,
      companySectorId,
      description,
     serviceFrequency,
      planId,
      professionalId,
    } = createServiceRequestDto;

 
    // 2. Prepara os dados de acordo com o tipo de requerente
    const requestData: Prisma.ServiceRequestCreateInput = {
      requesterType,
      requesterEmail,
      requesterPhoneNumber,
      description,
      serviceFrequency
      
    };

    if (requesterType === UserType.INDIVIDUAL) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: individualUserId
        }
      })
      const professional = await this.prisma.professional.findUnique({
        where: {
          id: professionalId
        }
      })
      if (!user) throw new ForbiddenException("Solicitante Não Identificado")
      if (!professional) throw new BadRequestException("Profissional Não encontrado")

      Object.assign(requestData, {
        individualRequesterName,
        individualIdentityNumber,
        individualAddress,
        individualUserId,
        professionalId,
      });
    } else if (requesterType === UserType.CORPORATE) {
      const District = await this.prisma.district.findUnique({
        where: {
          id: companyDistrictId
        }
      })
      const Sector = await this.prisma.sector.findUnique({
        where: {
          id: companySectorId
        }
      })
      const plan = await this.prisma.package.findUnique({
        where: {
          id: planId
        }
      })
      if (!District) throw new NotFoundException("Distrito Não encontrado")
      if (!Sector) throw new NotFoundException("Sector Não encontrado")
      if (!plan) throw new NotFoundException("Plano Não Identificado")
      Object.assign(requestData, {
        companyRequesterName,
        companyNif,
        companyAddress,
        companyDistrictId,
        companySectorId,
        planId,
      });
    }

    // 3. Cria a solicitação no banco de dados
    const serviceRequest = await this.prisma.serviceRequest.create({
      data: requestData,
    });

    // 4. Envia o e-mail de confirmação
    await this.sendServiceRequestConfirmation(
      serviceRequest.requesterEmail,
      serviceRequest.description,
    );

    return {
      message: 'Solicitação de serviço criada com sucesso.',
      requestId: serviceRequest.id,
    };
  }

  /**
   * Busca todas as solicitações de serviço com suporte a paginação e pesquisa.
   * @param query DTO com os parâmetros de consulta.
   * @returns Um objeto paginado com a lista de solicitações.
   */


async findAll(query: FilterServiceRequestsDto): Promise<PaginatedDto<ServiceRequest>> {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Combine todas as condições de filtro
  const filtersWhere: Prisma.ServiceRequestWhereInput = {
    // Filtro de busca (search)
    ...(query.search && {
      OR: [
        { requesterEmail: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { individualRequesterName: { contains: query.search, mode: 'insensitive' } },
        { companyRequesterName: { contains: query.search, mode: 'insensitive' } },
      ],
    }),

    // Filtro por tipo de solicitante (requesterType)
    ...(query.requesterType && {
      requesterType: query.requesterType,
    }),

    // Filtro por status
    ...(query.status && {
      status: query.status,
    }),

    // Filtro por descrição (se necessário)
    ...(query.description && {
      description: { contains: query.description, mode: 'insensitive' },
    }),
  };

  const [requests, total] = await this.prisma.$transaction([
    this.prisma.serviceRequest.findMany({
      skip,
      take: limit,
      where: filtersWhere,
      include: {
        individualClient: true,
        companyClient: true,
      },
    }),
    this.prisma.serviceRequest.count({ where: filtersWhere }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: requests,
    total,
    page,
    limit,
    totalPages,
  };
}

  /**
   * Busca uma única solicitação de serviço pelo seu ID.
   * @param id O ID da solicitação.
   * @returns A solicitação encontrada.
   * @throws NotFoundException se a solicitação não for encontrada.
   */
  async findOne(id: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        individualClient: true,
        companyClient: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Solicitação com ID "${id}" não encontrada.`);
    }

    return request;
  }

  /**
   * Atualiza uma solicitação de serviço existente.
   * @param id O ID da solicitação a ser atualizada.
   * @param updateServiceRequestDto DTO com os dados para atualização.
   * @returns A solicitação atualizada.
   */
  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto) {
    try {
      // Nota: A lógica de atualização pode ser mais complexa, por exemplo,
      // para associar um individualClientId ou companyClientId.
      // O DTO de atualização precisa ser ajustado para isso.
      return await this.prisma.serviceRequest.update({
        where: { id },
        data: updateServiceRequestDto as Prisma.ServiceRequestUpdateInput,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Solicitação com ID "${id}" não encontrada.`);
      }
      throw error;
    }
  }

  /**
   * Remove uma solicitação de serviço do sistema.
   * @param id O ID da solicitação a ser removida.
   * @returns A solicitação removida.
   * @throws NotFoundException se a solicitação não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.serviceRequest.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Solicitação com ID "${id}" não encontrada.`);
      }
      throw error;
    }
  }

  /**
   * Envia um e-mail de confirmação de recebimento da solicitação.
   * @param email O e-mail do solicitante.
   * @param description A descrição da solicitação.
   */
  private async sendServiceRequestConfirmation(
    email: string,
    description: string,
  ) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f7f9fc; border-radius: 8px; padding: 20px; color: #333;">
        <div style="background-color: #051f42ff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Solicitação de Serviço Recebida</h1>
        </div>
        <div style="padding: 20px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Olá,</p>
          <p style="font-size: 16px;">Confirmamos o recebimento da sua solicitação de serviço. Nossa equipe já está a analisar o seu pedido.</p>
          
       

          <p style="font-size: 15px;">Em breve entraremos em contacto para dar andamento à sua solicitação.</p>

          <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
            Este e-mail é automático. Por favor, não responda a esta mensagem.
          </p>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmação de Recebimento da sua Solicitação',
      html: htmlContent,
    });
  }
}