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
      expiresIn: '1h',
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

async refreshAccessToken(refreshToken: string) {
  try {
    // Verifica se o refresh token é válido
    const decoded = this.jwt.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET || 'superrefresh',
    });

    // Busca o admin pelo ID
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: decoded.sub },
      include: { permissions: true },
    });

    if (!admin) throw new UnauthorizedException('Admin não encontrado');

    // Recria o payload com permissões
    const permissionNames = admin.permissions.map((p) => p.name);

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: permissionNames,
    };

    // Gera um novo access token
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET || 'supersecret',
      expiresIn: '1h',
    });

    return { accessToken };
  } catch (error) {
    throw new UnauthorizedException('Refresh token inválido ou expirado');
  }
}


}
