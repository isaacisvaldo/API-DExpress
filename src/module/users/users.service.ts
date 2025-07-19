import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserForProfileDto } from './dto/create-user-for-profile.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';


@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) { }

  /**
   * Cria um usuário vinculado a um perfil (cliente ou empresa)
   * Gera uma senha temporária e envia por e-mail
   */
  async createUserForProfile(dto: CreateUserForProfileDto) {
    const tempPassword = randomBytes(4).toString('hex'); 
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    let email: string | undefined;

    if (dto.type === UserType.CLIENT) {
      const profile = await this.prisma.clientProfile.findUnique({
        where: { id: dto.profileId },
      });
      if (!profile) throw new NotFoundException('Perfil de cliente não encontrado.');
      email = profile.email;
    } else {
      const profile = await this.prisma.companyProfile.findUnique({
        where: { id: dto.profileId },
      });
      if (!profile) throw new NotFoundException('Perfil de empresa não encontrado.');
      email = profile.email;
    }
    const verify = await this.findByEmail(email)
    if (verify) {
      throw new BadRequestException('E-mail já cadastrado.');
    }
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        type: dto.type,
        clientProfileId: dto.type === UserType.CLIENT ? dto.profileId : undefined,
        companyProfileId: dto.type === UserType.COMPANY ? dto.profileId : undefined,
      },
    });

    // Enviar senha por e-mail
    await this.createUser(email, tempPassword);
    return {
      message: 'Usuário criado com sucesso. Senha enviada para o e-mail.',
      userId: user.id,
      email,
    };
  }

  /**
   * Buscar todos os usuários (opcional, pode paginar depois)
   */
  async findAll() {
    return this.prisma.user.findMany({
      
      include: {
        
        clientProfile: true,
        companyProfile: true,
      },
    });
  }
  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        companyProfile: true,
      },
    });
  }
  /**
   * Buscar usuário por e-mail
   */
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        clientProfile: true,
        companyProfile: true,
      },
    });
  }


  /**
   * Desativar usuário
   */
  async deactivateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
  async createUser(email: string, tempPassword: string) {

    const logoUrl = process.env.APP_LOGO_URL || 'https://d-express-web-site.vercel.app/img/logo.png';
    const portalUrl = process.env.PORTAL_URL || 'https://portal.dexpress.com';

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
