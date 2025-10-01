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
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';

import { ClientProfile as ClientProfileModel } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { ClientProfileService } from './clients.service';

@ApiTags('Client Profiles')
@ApiBearerAuth()
@Controller('client-profiles')
export class ClientProfileController {
  constructor(private readonly profileService: ClientProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os perfis de cliente com paginação e pesquisa.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de perfis paginada.', type: PaginatedDto })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<ClientProfileModel>> {
    return this.profileService.findAll(query);
  }
    @Get('all')
  findAllWithoutPagination(@Query('search') search?: string): Promise<ClientProfileModel[]> {
    return this.profileService.findAllWithoutPagination(search);
  }

  @Post()
  @ApiOperation({
    summary: 'Cria um novo perfil de cliente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Perfil de cliente criado com sucesso.',
    
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário já possui perfil ou não é do tipo INDIVIDUAL.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  create(
    @Request() 
    @Body() createDto: CreateClientProfileDto,
  ): Promise<ClientProfileModel> {
  
    return this.profileService.create(createDto);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Busca um perfil de cliente pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado.',
    
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  findOne(@Param('id') id: string): Promise<ClientProfileModel> {
    return this.profileService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Busca o perfil de cliente por ID do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado.',
    
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  findByUserId(@Param('userId') userId: string): Promise<ClientProfileModel> {
    return this.profileService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um perfil de cliente pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso.',
    
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClientProfileDto,
  ): Promise<ClientProfileModel> {
    return this.profileService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um perfil de cliente pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Perfil removido com sucesso.',
    
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  remove(@Param('id') id: string): Promise<ClientProfileModel> {
    return this.profileService.remove(id);
  }
}