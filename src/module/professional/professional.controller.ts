// src/professional/professional.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { Professional } from '@prisma/client';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'Busca um profissional pelo ID' })
  @ApiOkResponse({ description: 'Profissional encontrado.' })
  findOne(@Param('id') id: string) {
    return this.professionalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um profissional' })
  @ApiOkResponse({ description: 'Profissional atualizado com sucesso.' })
  @ApiBody({ type: UpdateProfessionalDto })
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um profissional' })
  @ApiOkResponse({ description: 'Profissional removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.professionalService.remove(id);
  }
}
