// src/specialty/specialty.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { Specialty } from '@prisma/client';
import { SpecialtyService } from './specialties.service';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';


@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova especialidade' })
  @ApiResponse({ status: 201, description: 'Especialidade criada com sucesso.' })
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as especialidades com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de especialidades paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Specialty>> {
    return this.specialtyService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todas as especialidades para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todas as especialidades.' })
  findAllForFrontend(): Promise<Specialty[]> {
    return this.specialtyService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma especialidade pelo ID' })
  @ApiOkResponse({ description: 'Especialidade encontrada.' })
  findOne(@Param('id') id: string) {
    return this.specialtyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma especialidade' })
  @ApiOkResponse({ description: 'Especialidade atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma especialidade' })
  @ApiOkResponse({ description: 'Especialidade removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }
}
