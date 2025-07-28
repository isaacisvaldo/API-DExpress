import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
      include: { permissions: true }, // Agora também carrega as permissões
    });

    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Extrai os nomes das permissões para incluir no JWT e na resposta
    const permissionNames = admin.permissions.map((p) => p.name);

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: permissionNames,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET || 'supersecret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'superrefresh',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: permissionNames,
      },
    };
  }
}
