import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as dns from 'dns';
import { testDomains } from 'src/common/test-domain';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) { }

  /**
   * Cria um novo usuário no sistema, gerando uma senha temporária e enviando por e-mail.
   * Não associa um perfil na criação.
   * @param createUserDto DTO com os dados para criação do usuário.
   * @returns O usuário criado e uma mensagem de sucesso.
   * @throws BadRequestException se o e-mail já estiver cadastrado.
   */

  async create(createUserDto: CreateUserDto, originDomain: string) {
    const { email, firstName, lastName, type } = createUserDto;


    // 3. Verificação de usuário existente
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    // Restante da sua lógica
    const tempPassword = randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        type,
      },
    });

    await this.sendWelcomeEmail(email, tempPassword, originDomain);

    return {
      message: 'Usuário criado com sucesso. Senha temporária enviada por e-mail.',
      userId: user.id,
      email: user.email,
    };
  }



  async findAll(query: FindAllDto): Promise<PaginatedDto<User>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const searchWhere: Prisma.UserWhereInput = query.search
      ? {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      }
      : {};



    const where: Prisma.UserWhereInput = {
      AND: [
        {
          clientProfile: {
            some: {
              id: { not: undefined },
            },
          },
        },
        searchWhere,
      ],
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        include: {
          clientProfile: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        type: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        clientProfile: {
          include: {
            contract:true
          }
        },
       
      },

    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
     select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        type: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        clientProfile: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.email) {
        const existingUser = await this.findByEmail(updateUserDto.email);
        if (existingUser && existingUser.id !== id) {
          throw new BadRequestException('E-mail já cadastrado por outro usuário.');
        }
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }
      throw error;
    }
  }

  async deactivate(id: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }
      throw error;
    }
  }
  /**
  * Busca todos os usuários que não possuem perfil de cliente ou perfil de empresa associado.
  * @returns Uma lista de usuários sem perfil.
  */
  /**
    * Busca todos os usuários que não possuem perfil de cliente ou perfil de empresa associado,
    * com suporte a paginação e pesquisa.
    * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
    * @returns Um objeto com a lista de usuários sem perfil, a contagem total, a página atual e o limite.
    */
  async findUsersWithoutProfile(query: FindAllDto): Promise<PaginatedDto<User>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const searchWhere: Prisma.UserWhereInput = query.search
      ? {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      }
      : {};

    const where: Prisma.UserWhereInput = {
      AND: [
        {
          clientProfile: {
            none: {}, // Não tem perfil de cliente
          },
        },

        searchWhere, // Aplica os filtros de pesquisa
      ],
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        include: {
          clientProfile: true,

        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  private async sendWelcomeEmail(email: string, tempPassword: string, originDomain: string) {

    const portalUrl = originDomain

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

          <a href="${portalUrl}"
          style="display: inline-block; background-color: #030c27ff; color: #ffffff; padding: 12px 24px;
                    text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-top: 20px;"
          target="_blank"
             style="display: inline-block; background-color: #071d3bff; color: #ffffff; padding: 12px 24px;
                    text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
            Acessar Portal
          </a>

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