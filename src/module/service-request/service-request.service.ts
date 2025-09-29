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
import { ServiceRequest, Prisma, UserType, StatusRequest } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import { FilterServiceRequestsDto } from './dto/filter-service-requests.dto';
import { CreateContractInRequestDto } from './dto/create-contract-inRequestService';
import { ContractNumberHelper } from 'src/helpers/contract-number.helper';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuditLogService } from '../shared/auditLog/auditLog.service';


const contractInclude = {
  professional: true,
  individualClient: true,
  companyClient: true,
  package: true,
  desiredPosition: true,
  location: {
    include: {
      city: true,
      district: true,
    },
  },
  contractPackegeProfissional: {
    include: {
      professional: true,
    },
  },
};


@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractNumberHelper: ContractNumberHelper,

    private readonly mailerService: MailerService,
     private readonly auditLogService: AuditLogService,
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
      const verifyRequeser = await this.prisma.serviceRequest.findFirst({
        where: {
          individualUserId: individualUserId,
          status: "PENDING"
        }
      })
      if (verifyRequeser) throw new BadRequestException("Já existe uma solicitação pendente para este usuário")
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
      const verifyRequeser = await this.prisma.serviceRequest.findFirst({
        where: {
          companyNif: companyNif,
          status: "PENDING"
        }
      })
      if (verifyRequeser) throw new BadRequestException("Já existe uma solicitação pendente para esta empresa")
      const District = await this.prisma.district.findUnique({
        where: {
          id: companyDistrictId
        }
      })
      if (!District) throw new NotFoundException("Distrito Não encontrado")
      const Sector = await this.prisma.sector.findUnique({
        where: {
          id: companySectorId
        }
      })
      if (!Sector) throw new NotFoundException("Sector Não encontrado")
      const plan = await this.prisma.package.findUnique({
        where: {
          id: planId
        }
      })


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
        companySector: true,
        package: true,
        professional: true,

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
  async findServiceRequestByUserId(userId: string, query): Promise<PaginatedDto<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Combine todas as condições de filtro
    const filtersWhere: Prisma.ServiceRequestWhereInput = {
      individualUserId: userId,
      // Filtro de busca (search)
      ...(query.search && {
        OR: [
          { requesterEmail: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { individualRequesterName: { contains: query.search, mode: 'insensitive' } },

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
        select: {

          id: true,
          status: true,
          serviceFrequency: true,
          description: true,
          createdAt: true,

          professional: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              identityNumber: true,
              isAvailable: true,
              description: true,
              expectedAvailability: true,
              hasCriminalRecord: true,
              hasMedicalCertificate: true,
              hasTrainingCertificate: true,
              location: {
                select: {
                  id: true,
                  street: true,
                  city: {
                    select: {
                      name: true
                    }
                  },
                  district: {
                    select: {
                      name: true
                    }

                  }
                }

              },
              profileImage: true,
              gender: true,
              birthDate: true,
              hasChildren: true,
              knownDiseases: true,
              createdAt: true,
              experienceLevel: true,
              maritalStatus: true,
              highestDegree: true,


            },
          },
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
  async findServiceRequestByCompanyNif(companyNif: string, query): Promise<PaginatedDto<ServiceRequest>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Combine todas as condições de filtro
    const filtersWhere: Prisma.ServiceRequestWhereInput = {
      companyNif: companyNif,
      // Filtro de busca (search)
      ...(query.search && {
        OR: [
          { requesterEmail: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },

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

          package: true
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
  async updateStatus(id: string, status: StatusRequest) {
    return await this.prisma.serviceRequest.update({
      where: { id },
      data: { status },
    });

  }

  async createContractInRequest(
    id: string,
    createContractDto: CreateContractInRequestDto,
  ) {
    const {
      professionalId,
      professionalIds,
      individualClientId,
      companyClientId,
      packageId,
      desiredPositionId,
      location,
      ...contractData
    } = createContractDto;

    // Validação de consistência de dados
    if (contractData.clientType === UserType.INDIVIDUAL) {
      if (!professionalId) {
        throw new BadRequestException(
          'Para clientes individuais, `professionalId` é obrigatório.',
        );
      }
    } else if (contractData.clientType === UserType.CORPORATE) {
      if (!professionalIds || professionalIds.length === 0) {
        throw new BadRequestException(
          'Para clientes empresariais, `companyClientId` e `professionalIds` são obrigatórios.',
        );
      }
    }

    let clientId: string | null = null;

    return this.prisma.$transaction(
      async (prisma) => {
        // 1. Valida se os profissionais existem
        if (professionalIds && professionalIds.length > 0) {
          const existingProfessionals = await prisma.professional.findMany({
            where: { id: { in: professionalIds } },
            select: { id: true },
          });

          if (existingProfessionals.length !== professionalIds.length) {
            const foundIds = existingProfessionals.map((p) => p.id);
            const notFoundIds = professionalIds.filter(
              (id) => !foundIds.includes(id),
            );
            throw new NotFoundException(
              `Os seguintes IDs de profissionais não foram encontrados: ${notFoundIds.join(
                ', ',
              )}`,
            );
          }
        }

        // 2. Criação da Localização
        const endereco = await prisma.location.create({
          data: {
            cityId: location.cityId,
            districtId: location.districtId,
            street: location.street,
          },
        });

        // 3. Criação do cliente
        if (contractData.clientType === UserType.INDIVIDUAL) {
          const verifyEmail = await this.prisma.user.findFirst({
            where: { email: contractData.email },
          });
          if (verifyEmail)
            throw new BadRequestException('Email já cadastrado');

          const verifyEmail2 = await this.prisma.clientProfile.findFirst({
            where: { email: contractData.email },
          });
          if (verifyEmail2)
            throw new BadRequestException('Email já cadastrado');

          const tempPassword = randomBytes(4).toString('hex');
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          const user = await this.prisma.user.create({
            data: {
              firstName: contractData.firstName,
              lastName: contractData.lastName,
              email: contractData.email,
              password: hashedPassword,
              type: contractData.clientType,
            },
          });

          if (user) {
            const profile = await this.prisma.clientProfile.create({
              data: {
                fullName: `${contractData.firstName} ${contractData.lastName}`,
                identityNumber: contractData.identityNumber,
                email: contractData.email,
                phoneNumber: contractData.phone,
                address: '',
                userId: user.id,
              },
            });
            clientId = profile.id;
          }
        } else {
          const company = await this.prisma.clientCompanyProfile.create({
            data: {
              companyName: contractData.companyName,
              nif: contractData.nif || '0000000',
              email: contractData.email,
              phoneNumber: contractData.phone,
              address: location.street,
              districtId: location.districtId,
              sectorId: contractData.sectorId,
            },
          });
          clientId = company.id;
        }

        // 4. Montagem do contrato base
        const contractNumber = await this.contractNumberHelper.generate();

        let contractDataToSave: any = {
          contractNumber,
          title: contractData.title ?? 'Contract Title',
          clientType: contractData.clientType,
          packageId: packageId ?? null,
          desiredPositionId: desiredPositionId ?? null,
          description: contractData.description ?? '',
          serviceFrequency: 'ANNUALLY',
          agreedValue: contractData.agreedValue ?? 0.0,
          discountPercentage: contractData.discountPercentage ?? 0.0,
          finalValue: contractData.finalValue ?? 0.0,
          paymentTerms: contractData.paymentTerms ?? 'Teste',
          startDate: contractData.startDate
            ? new Date(contractData.startDate)
            : new Date(),
          endDate: contractData.endDate
            ? new Date(contractData.endDate)
            : null,
          status: 'ACTIVE',
          locationId: endereco.id,
          notes: contractData.notes ?? null,
        };

        if (contractData.clientType === UserType.INDIVIDUAL) {
          contractDataToSave = {
            ...contractDataToSave,
            packageId: null,
            professionalId,
            individualClientId: clientId,
            companyClientId: null,
          };
        } else if (contractData.clientType === UserType.CORPORATE) {
          contractDataToSave = {
            ...contractDataToSave,
            professionalId: null,
            desiredPositionId: null,
            individualClientId: null,
            companyClientId: clientId,
          };
        }

        // 5. Criação do contrato
        const newContract = await prisma.contract.create({
          data: contractDataToSave,
        });

        // 6. Criação da tabela de junção (somente corporativo)
        if (
          contractData.clientType === UserType.CORPORATE &&
          professionalIds &&
          professionalIds.length > 0
        ) {
          const contractPackageProfessionalData = professionalIds.map((id) => ({
            professionalId: id,
            contractId: newContract.id,
          }));

          await prisma.contractPackegeProfissional.createMany({
            data: contractPackageProfessionalData,
          });
        }

        await this.marcarProfissionaisIndisponiveis(
          prisma,
          contractData.clientType,
          professionalId,
          professionalIds,
        );

        const createdContract = await prisma.contract.findUnique({
          where: { id: newContract.id },
          include: contractInclude,
        });

        // 🔹 Adiciona log de auditoria
        await this.auditLogService.createLog({
          action: 'CREATE_CONTRACT_IN_REQUEST',
          entity: 'Contract',
          entityId: createdContract!.id,
          description: `Contrato ${createdContract!.contractNumber} criado via request`,
          newData: createdContract,
          status: 'SUCCESS',
          source: 'USER',
        });

        return createdContract!;
      },
      { timeout: 30000 },
    );
  }

  async marcarProfissionaisIndisponiveis(
    prisma: Prisma.TransactionClient,
    clientType: UserType,
    professionalId?: string,
    professionalIds?: string[],
  ) {
    if (clientType === UserType.INDIVIDUAL && professionalId) {
      await prisma.professional.update({
        where: { id: professionalId },
        data: { isAvailable: false },
      });
    }

    if (clientType === UserType.CORPORATE && professionalIds && professionalIds.length > 0) {
      await prisma.professional.updateMany({
        where: { id: { in: professionalIds } },
        data: { isAvailable: false },
      });
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