import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtAuthGuard } from 'src/common/secret/jwt-auth.guard';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly service: AdminAuthService) {}

  @Post('login')
  async login(@Body() dto: AdminLoginDto) {
    return this.service.login(dto);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    // Verifica se o refresh token foi fornecido
    
    if (!refreshToken) {
      throw new UnauthorizedException('Token de atualização não fornecido');
    }
    return this.service.refreshAccessToken(refreshToken);
  }
    // NOVA ROTA: Valida se o usuário ainda está autenticado
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validate(@Req() req: any) {
    return { valid: true, user: req.user };
  }
}
