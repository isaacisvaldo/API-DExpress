// src/admin-user/admin-users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AdminUserService } from './admin-user.service';
import { JwtAuthGuard } from 'src/common/secret/jwt-auth.guard';

import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.ts';
import { UpdateAdminUserDto } from './dto/update-admin.dto';

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo utilizador administrador' })
  @ApiResponse({ status: 201, description: 'Utilizador criado com sucesso' })
  async createAdmin(@Body() dto: CreateAdminUserDto, @Req() req: any) {
    const creatorId = req.user.sub;
    return this.service.create(dto, creatorId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Busca o perfil do utilizador logado' })
  @ApiResponse({ status: 200, description: 'Detalhes do perfil' })
  async getProfile(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new UnauthorizedException('Utilizador não autenticado');
    }
    return this.service.getProfileData(userId);
  }

  @Get("users")
  @ApiOperation({ summary: 'Lista todos os utilizadores administradores com paginação' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista paginada de utilizadores' })
  async findAll(@Query() query: FindAllDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um utilizador administrador pelo ID' })
  @ApiOkResponse({ description: 'Detalhes do utilizador' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um utilizador administrador' })
  @ApiOkResponse({ description: 'Utilizador atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  async update(@Param('id') id: string, @Body() updateAdminUserDto: UpdateAdminUserDto) {
    return this.service.update(id, updateAdminUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um utilizador administrador' })
  @ApiOkResponse({ description: 'Utilizador deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
