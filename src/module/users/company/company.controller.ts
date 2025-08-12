// src/company/client-company-profile.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

import { ClientCompanyProfile  } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { ClientCompanyProfileService } from './company.service';

@ApiTags('Client Company Profiles')
@ApiBearerAuth()
@Controller('client-company-profiles')
export class ClientCompanyProfileController {
  constructor(
    private readonly profileService: ClientCompanyProfileService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os perfis de empresa com paginação e pesquisa.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de perfis paginada.', type: PaginatedDto })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<ClientCompanyProfile>> {
    return this.profileService.findAll(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Cria um novo perfil de empresa para o usuário autenticado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Perfil de empresa criado com sucesso.',
    
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário já possui perfil ou não é do tipo CORPORATE.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  create(
    @Request() req: any,
    @Body() createDto: CreateCompanyProfileDto,
  ): Promise<ClientCompanyProfile> {

    return this.profileService.create( createDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um perfil de empresa pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado.',
    
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  findOne(
    @Param('id') id: string,
  ): Promise<ClientCompanyProfile> {
    return this.profileService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Busca o perfil de empresa por ID do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado.',
   
  })


  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um perfil de empresa pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso.',
   
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyProfileDto,
  ): Promise<ClientCompanyProfile> {
    return this.profileService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um perfil de empresa pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil removido com sucesso.',
    
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  remove(@Param('id') id: string): Promise<ClientCompanyProfile> {
    return this.profileService.remove(id);
  }
}