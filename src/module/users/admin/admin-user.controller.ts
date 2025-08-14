// src/admin-user/admin-users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AdminUserService } from './admin-user.service';
import { JwtAuthGuard } from 'src/common/secret/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/secret/permissions.guard';
import { PermissionType } from 'src/common/enums/permission.type';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.ts';
import { UpdateAdminUserDto } from './dto/update-admin.dto';
import { RequiredPermissions } from 'src/common';

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @Post("users")
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(PermissionType.UsersCreate) 
  @ApiOperation({ summary: 'Cria um novo utilizador administrador' })
  @ApiResponse({ status: 201, description: 'Utilizador criado com sucesso' })
  async createAdmin(@Body() dto: CreateAdminUserDto, @Req() req: any) {
     const originDomain = req.headers['origin']; 
    
    const creatorId = req.user.sub || req.user.id;
    return this.service.create(dto, creatorId,originDomain);
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
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(PermissionType.UsersView)
  @ApiOperation({ summary: 'Lista todos os utilizadores administradores com paginação' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista paginada de utilizadores' })
  async findAll(@Query() query: FindAllDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(PermissionType.UsersView)
  @ApiOperation({ summary: 'Busca um utilizador administrador pelo ID' })
  @ApiOkResponse({ description: 'Detalhes do utilizador' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(PermissionType.UsersUpdate)
  @ApiOperation({ summary: 'Atualiza um utilizador administrador' })
  @ApiOkResponse({ description: 'Utilizador atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  async update(@Param('id') id: string, @Body() updateAdminUserDto: UpdateAdminUserDto) {
    return this.service.update(id, updateAdminUserDto);
  }

  @Delete('users/:id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(PermissionType.UsersDelete)
  @ApiOperation({ summary: 'Deleta um utilizador administrador' })
  @ApiOkResponse({ description: 'Utilizador deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Utilizador não encontrado' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
