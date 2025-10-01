import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ClientProfile, Prisma, UserType } from '@prisma/client';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class ClientProfileService {
  constructor(private readonly prisma: PrismaService, private readonly mailerService: MailerService) { }

  /**
   * Lista todos os perfis de cliente com paginação e pesquisa.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<ClientProfile>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientProfileWhereInput = query.search
      ? {
        OR: [
          { fullName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      }
      : {};

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.clientProfile.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: true,
        },
      }),
      this.prisma.clientProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: profiles,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Lista todos os perfis de cliente sem paginação, com pesquisa opcional.
   */
  async findAllWithoutPagination(search?: string): Promise<ClientProfile[]> {
    const where: Prisma.ClientProfileWhereInput = search
      ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
      : {};

    const profiles = await this.prisma.clientProfile.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        fullName: 'asc', // Ordena por nome completo para melhor visualização
      },
    });

    return profiles;
  }


  async create(
   
    createDto: CreateClientProfileDto,
  ): Promise<ClientProfile> {
    const { email, firstName, lastName, identityNumber, phoneNumber, optionalContacts, address ,password} = createDto;


    // 3. Verificação de usuário existente
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado No Portal :::.');
    }
    return this.prisma.$transaction(async (prisma) => {

      // Restante da sua lógica
       const passwordplane = password || Math.random().toString(36).slice(-8);
         const hashedPassword = await bcrypt.hash(passwordplane, 10);

      const NewUser = await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          type: UserType.INDIVIDUAL,
        },
      });

     
      const newProfile = {
        userId: NewUser.id,
        email,
        fullName: `${firstName} ${lastName}`,
        identityNumber,
        phoneNumber,
        optionalContacts,
        address,
        
      }
      await this.sendWelcomeEmail(email, passwordplane);
      return await this.prisma.clientProfile.create({
        data: {
          ...newProfile
        },
      });

    }, {
      timeout: 30000,
    });

  }

  /**
   * Busca um perfil de cliente pelo seu ID.
   */
  async findOne(id: string): Promise<ClientProfile> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil de cliente com ID '${id}' não encontrado.`);
    }
    return profile;
  }

  /**
   * Busca um perfil de cliente pelo ID do usuário.
   */
  async findByUserId(userId: string): Promise<ClientProfile> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de cliente para o usuário com ID '${userId}' não encontrado.`,
      );
    }
    return profile;
  }

  /**
   * Atualiza um perfil de cliente existente.
   */
  async update(
    id: string,
    updateDto: UpdateClientProfileDto,
  ): Promise<ClientProfile> {
    try {
        const { email, firstName, lastName, identityNumber, phoneNumber, optionalContacts, address } = updateDto;

      return await this.prisma.clientProfile.update({
        where: { id },
        data:  {
          email,
          fullName: `${firstName} ${lastName}`,
          identityNumber,
          phoneNumber,
          optionalContacts,
          address,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil de cliente com ID '${id}' não encontrado.`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * Remove um perfil de cliente.
   */
  async remove(id: string): Promise<ClientProfile> {
    try {
      return await this.prisma.clientProfile.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil de cliente com ID '${id}' não encontrado.`,
          );
        }
      }
      throw error;
    }
  }
  private async sendWelcomeEmail(email: string, tempPassword: string) {



    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f7f9fc; border-radius: 8px; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
             <div style="font-size: 50px; text-align: center;"></div>
        </div>
        <div style="background-color: #051f42ff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Bem-vindo ao Portal DExpress</h1>
        </div>
        <div style="padding: 20px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Olá,</p>
          <p style="font-size: 16px;">Sua conta foi criada com sucesso! Aqui estão suas credenciais para acesso:</p>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; font-size: 16px;">
            <strong>E-mail:</strong> ${email} <br/>
            <strong>Senha Temporária:</strong> ${tempPassword}
          </div>

          <p style="font-size: 15px;">Por motivos de segurança, altere sua senha assim que fizer login no portal.</p>

        

          <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
            Este e-mail é automático. Não responda a esta mensagem.
          </p>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo ao Portal DExpress',
      html: htmlContent,
    });
  }
}