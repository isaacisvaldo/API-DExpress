import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { Profile } from '@prisma/client';
import { ProfileService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo perfil' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiBody({ type: CreateProfileDto })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna uma lista paginada de perfis' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, type: PaginatedDto<Profile>, description: 'Lista de perfis retornada com sucesso.' })
  findAll(@Query() query: FindAllDto) {
    return this.profilesService.findAll(query);
  }

  @Get('all')
  @ApiOperation({ summary: 'Retorna todos os perfis para uso em formulários (sem paginação)' })
  @ApiResponse({ status: 200, description: 'Lista completa de perfis retornada com sucesso.' })
  findAllForFrontend() {
    return this.profilesService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um perfil pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do perfil (UUID)', type: String })
  @ApiResponse({ status: 200, description: 'Perfil encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um perfil pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do perfil (UUID)', type: String })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um perfil pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do perfil (UUID)', type: String })
  @ApiResponse({ status: 200, description: 'Perfil removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado.' })
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}
