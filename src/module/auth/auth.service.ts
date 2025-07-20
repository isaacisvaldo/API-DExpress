import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, type: user.type };
    const token = this.jwtService.sign(payload);
    // Busca dados do perfil
    let profile: any = null;
    if (user.type === 'CLIENT') {
      profile = await this.prisma.clientProfile.findUnique({ where: { id: user.clientProfileId } });
    } else if (user.type === 'COMPANY') {
      profile = await this.prisma.companyProfile.findUnique({ where: { id: user.companyProfileId } });
    }
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        profile,
      },
    };
  }
}
