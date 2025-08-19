// src/professional/professional.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Professional } from '@prisma/client';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@ApiTags('Professionals')
@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo profissional' })
  @ApiResponse({ status: 201, description: 'Profissional criado com sucesso.' })
  @ApiBody({ type: CreateProfessionalDto })
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.create(createProfessionalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os profissionais com paginação e filtros' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de profissionais paginada e filtrada.' })
  findAll(@Query() filter: FilterProfessionalDto): Promise<PaginatedDto<Professional>> {
    return this.professionalService.findAll(filter);
  }
    @Get("public-professionals")
  @ApiOperation({ summary: 'Lista todos os profissionais com paginação e filtros (PARA O PORTAL)' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de profissionais paginada e filtrada.' })
  getPublicProfessionals(@Query() filter: FilterProfessionalDto): Promise<PaginatedDto<Professional>> {
    return this.professionalService.getPublicProfessionals(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um profissional pelo ID' })
  @ApiOkResponse({ description: 'Profissional encontrado.' })
  findOne(@Param('id') id: string) {
    return this.professionalService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um profissional' })
  @ApiOkResponse({ description: 'Profissional atualizado com sucesso.' })
  @ApiBody({ type: UpdateProfessionalDto })
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalService.update(id, updateProfessionalDto);
  }

  // --- NOVA ROTA ADICIONADA ---
  @Patch(':id/availability/:isAvailable')
  @ApiOperation({ summary: 'Atualiza a disponibilidade de um profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional', type: String })
  @ApiParam({ name: 'isAvailable', description: 'Novo estado de disponibilidade', type: Boolean })
  @ApiOkResponse({ description: 'Disponibilidade do profissional atualizada com sucesso.' })
  updateAvailability(
    @Param('id') id: string, 
    @Param('isAvailable') isAvailable: string
  ) {
    // Note que o valor do parâmetro da URL é uma string ('true' ou 'false')
    // e precisa ser convertido para um booleano.
    const newIsAvailable = isAvailable === 'true'; 
    return this.professionalService.updateAvailability(id, newIsAvailable);
  }

   @Patch(':id/image-url')
  @ApiOperation({ summary: 'Atualiza a URL da imagem de perfil de um profissional' })
  @ApiParam({ name: 'id', description: 'ID do profissional', type: String })
  @ApiBody({ type: UpdateImageDto, description: 'Objeto contendo a nova URL da imagem.' })
  @ApiResponse({ status: 200, description: 'URL da imagem de perfil atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Profissional não encontrado.' })
  async updateImageUrl(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.professionalService.updateImageUrl(id, updateImageDto.imageUrl);
  }

  // --- FIM DA NOVA ROTA ADICIONADA ---

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um profissional' })
  @ApiOkResponse({ description: 'Profissional removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.professionalService.remove(id);
  }
}