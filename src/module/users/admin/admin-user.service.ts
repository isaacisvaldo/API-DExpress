import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service'; // Ajuste o caminho conforme o seu projeto
import * as bcrypt from 'bcrypt';

import { MailerService } from '@nestjs-modules/mailer';
import { AdminUser, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.ts';
import { UpdateAdminUserDto } from './dto/update-admin.dto';


@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService, private readonly mailerService: MailerService) {}

  /**
   * Cria um novo utilizador administrador.
   * Apenas o Admin Geral pode executar esta ação.
   * @param dto DTO com os dados do novo administrador.
   * @param creatorId ID do utilizador que está a criar.
   * @returns Mensagem de sucesso e o ID do novo administrador.
   */
  async create(dto: CreateAdminUserDto, creatorId: string) {
    // 1. Verifica se quem cria é um Admin Geral
    const creator = await this.prisma.adminUser.findUnique({ where: { id: creatorId } });
    if (!creator || creator.role !== 'GENERAL_ADMIN') {
      throw new ForbiddenException('Somente o Admin Geral pode criar novos administradores.');
    }

    // 2. Verifica duplicidade de email ou identidade
    const existing = await this.prisma.adminUser.findFirst({
      where: { OR: [{ email: dto.email }, { identityNumber: dto.identityNumber }] },
    });
    if (existing) {
      throw new ForbiddenException('Administrador já existe com este email ou número de identidade.');
    }

    // 3. Gera senha segura caso não tenha sido fornecida
    const password = dto.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Cria o novo admin na base de dados
    const newAdmin = await this.prisma.adminUser.create({
      data: {
        name: dto.name,
        numberphone: dto.numberphone,
        identityNumber: dto.identityNumber,
        genderId: dto.genderId,
        birthDate: dto.birthDate,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        permissions: dto.permissions
          ? { connectOrCreate: dto.permissions.map((p) => ({ where: { name: p }, create: { name: p } })) }
          : undefined,
      },
      include: { permissions: true ,gender:true},
    });

    // 5. Envia o email de boas-vindas
    await this.sendAdminWelcomeEmail(newAdmin.email, password);
    return { message: 'Administrador criado com sucesso', id: newAdmin.id };
  }
  
  /**
   * Busca e retorna dados do perfil de um administrador.
   * @param userId ID do administrador.
   * @returns Objeto com os dados do perfil, sem a senha.
   */
  async getProfileData(userId: string) {
    if (!userId) {
      throw new ForbiddenException('Utilizador não autenticado ou ID inválido');
    }
    
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: userId },
      include: { 
        permissions: true, 
        accountSettings: true, 
        notificationSettings: true, 
        securitySettings: true,
      },
    });

    if (!admin) {
      throw new ForbiddenException('Administrador não encontrado');
    }
 
    // Monta a resposta (escondendo a senha por segurança)
    return {
      id: admin.id,
      name: admin.name,
      numberphone: admin.numberphone,
      isActive: admin.isActive,
      identityNumber: admin.identityNumber,
      birthDate: admin.birthDate,
      email: admin.email,
      avatar: admin.avatar,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      // Relacionamentos
      permissions: admin.permissions.map((p) => p.name),
      accountSettings: admin.accountSettings,
      notificationSettings: admin.notificationSettings,
      securitySettings: admin.securitySettings,
    };
  }
  
  /**
   * Busca todos os utilizadores administradores com paginação e filtro.
   * @param query DTO com os parâmetros de pesquisa, página e limite.
   * @returns Lista paginada de utilizadores.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<AdminUser>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AdminUserWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await this.prisma.$transaction([
      this.prisma.adminUser.findMany({
        skip,
        take: limit,
        where,
        include: {
          gender: true,
        },
      }),
      this.prisma.adminUser.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
    } as PaginatedDto<AdminUser>;
  }

  /**
   * Busca um único utilizador administrador pelo ID.
   * @param id ID do utilizador.
   * @returns O objeto do utilizador.
   */
  async findOne(id: string): Promise<AdminUser> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
      include: {
        gender: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilizador com o ID "${id}" não encontrado`);
    }
    return user;
  }

  /**
   * Atualiza um utilizador administrador.
   * @param id ID do utilizador.
   * @param updateAdminUserDto DTO com os dados a serem atualizados.
   * @returns O objeto do utilizador atualizado.
   */
  async update(id: string, updateAdminUserDto: UpdateAdminUserDto): Promise<AdminUser> {
    // ✅ Filtra todas as propriedades que têm o valor undefined do DTO
    const data = Object.fromEntries(
      Object.entries(updateAdminUserDto).filter(([_, value]) => value !== undefined)
    );

    try {
      return await this.prisma.adminUser.update({
        where: { id },
        // ✅ Agora, apenas as propriedades com valor serão enviadas
        data: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Utilizador com o ID "${id}" não encontrado`);
      }
      throw error;
    }
  }


  /**
   * Remove um utilizador administrador.
   * @param id ID do utilizador.
   * @returns O objeto do utilizador removido.
   */
  async remove(id: string): Promise<AdminUser> {
    try {
      return await this.prisma.adminUser.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Utilizador com o ID "${id}" não encontrado`);
      }
      throw error;
    }
  }

  /**
   * Envia um email de boas-vindas com credenciais temporárias para o administrador.
   * @param adminEmail O email do administrador.
   * @param tempPassword A senha temporária.
   */
  async sendAdminWelcomeEmail(adminEmail: string, tempPassword: string) {
    const dashboardUrl = process.env.DASHBOARD_URL 
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f7f9fc; border-radius: 8px; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
              <div style="font-size: 50px; text-align: center;">🛠️</div>
        </div>
        <div style="background-color: #051f42ff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Acesso ao Painel Administrativo</h1>
        </div>
        <div style="padding: 20px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Olá,</p>
          <p style="font-size: 16px;">
            Sua conta de <strong>Administrador DExpress</strong> foi criada com sucesso!  
            Utilize as credenciais abaixo para acessar o painel administrativo.
          </p>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; font-size: 16px;">
            <strong>E-mail:</strong> ${adminEmail} <br/>
            <strong>Senha Temporária:</strong> ${tempPassword}
          </div>

          <p style="font-size: 15px;">
            Por questões de segurança, altere sua senha assim que acessar o sistema.
          </p>

          <a href="${dashboardUrl}" 
          style="display: inline-block; background-color: #051f42ff; color: #ffffff; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-top: 20px;"
          target="_blank">
            Acessar Painel
          </a>

          <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
            Este e-mail é automático. Não responda a esta mensagem.
          </p>
        </div>
      </div>`;

    await this.mailerService.sendMail({
      to: adminEmail,
      subject: 'Credenciais do Painel Administrativo - DExpress',
      html: htmlContent,
    });
  }
}
