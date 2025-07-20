import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/secret/jwt-auth.guard';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.ts';

@ApiTags('Admin')
@Controller('admin')
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  async createAdmin(@Body() dto: CreateAdminUserDto, @Req() req: any) {
    const creatorId = req.user.sub;
    return this.service.create(dto, creatorId);
  }
}
