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
    // ✅ Incluir o perfil e as permissões dentro dele
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email ,isActive:true},
      include: {
        profile: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    // ✅ Mapear as permissões a partir do perfil
    const permissionNames = admin.profile?.permissions.map((p) => p.name) || [];
    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.profile.label,
      avatar:admin.avatar,
      permissions: permissionNames,
    };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, 
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.profile.label,
        avatar:admin.avatar,
        permissions: permissionNames,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // ✅ Incluir o perfil e as permissões dentro dele
      const admin = await this.prisma.adminUser.findUnique({
        where: { id: decoded.sub },
        include: {
          profile: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!admin) throw new UnauthorizedException('Admin não encontrado');

      // ✅ Mapear as permissões a partir do perfil
      const permissionNames = admin.profile?.permissions.map((p) => p.name) || [];

      const payload = {
        sub: admin.id,
        email: admin.email,
        role: admin.profile.label,
         avatar:admin.avatar,
        permissions: permissionNames,
      };

      const accessToken = this.jwt.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}
