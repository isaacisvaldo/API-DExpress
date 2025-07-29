import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { MailerService } from '@nestjs-modules/mailer';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.ts';

@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService, private readonly mailerService: MailerService) {}

  async create(dto: CreateAdminUserDto, creatorId: string) {
    // Verifica se quem cria é um Admin Geral
    const creator = await this.prisma.adminUser.findUnique({ where: { id: creatorId } });
    if (!creator || creator.role !== 'GENERAL_ADMIN') {
      throw new ForbiddenException('Somente o Admin Geral pode criar novos administradores.');
    }

    // Verifica duplicidade de email ou identidade
    const existing = await this.prisma.adminUser.findFirst({
      where: { OR: [{ email: dto.email }, { identityNumber: dto.identityNumber }] },
    });
    if (existing) throw new ForbiddenException('Administrador já existe com este email ou número de identidade.');

    // Gera senha caso não tenha
    const password = dto.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria admin
    const newAdmin = await this.prisma.adminUser.create({
      data: {
        name: dto.name,
        numberphone: dto.numberphone,
        identityNumber: dto.identityNumber,
        gender: dto.gender,
        birthDate: dto.birthDate,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        permissions: dto.permissions
          ? { connectOrCreate: dto.permissions.map((p) => ({ where: { name: p }, create: { name: p } })) }
          : undefined,
      },
      include: { permissions: true },
    });

    // Envia email
 
    await this.sendAdminWelcomeEmail(newAdmin.email, password);
    return { message: 'Administrador criado com sucesso', id: newAdmin.id };
  }
  async sendAdminWelcomeEmail(adminEmail: string, tempPassword: string) {
       const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000/admin';
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

async getProfileData(userId: string) {
    if (!userId) {
    throw new ForbiddenException('Usuário não autenticado ou ID inválido');
  }
  const admin = await this.prisma.adminUser.findUnique({
    where: { id: userId },
    include: { permissions: true, accountSettings: true, notificationSettings: true, securitySettings: true },
  });

  if (!admin) {
    throw new ForbiddenException('Administrador não encontrado');
  }
  console.log(admin);
  

 // Monta a resposta (escondendo senha)
    return {
      id: admin.id,
      name: admin.name,
      numberphone: admin.numberphone,
      isActive: admin.isActive,
      identityNumber: admin.identityNumber,
      gender: admin.gender,
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


}
