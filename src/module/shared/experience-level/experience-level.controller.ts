// src/module/shared/experience-level/experience-level.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExperienceLevelService } from './experience-level.service';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { ExperienceLevel } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Experience Levels')
@Controller('experience-levels')
export class ExperienceLevelController {
  constructor(private readonly experienceLevelService: ExperienceLevelService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo nível de experiência' })
  @ApiResponse({ status: 201, description: 'Nível de experiência criado com sucesso.' })
  create(@Body() createExperienceLevelDto: CreateExperienceLevelDto) {
    return this.experienceLevelService.create(createExperienceLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os níveis de experiência com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de níveis de experiência paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<ExperienceLevel>> {
    return this.experienceLevelService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os níveis de experiência para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todos os níveis de experiência.' })
  findAllForFrontend(): Promise<ExperienceLevel[]> {
    return this.experienceLevelService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um nível de experiência pelo ID' })
  @ApiOkResponse({ description: 'Nível de experiência encontrado.' })
  findOne(@Param('id') id: string) {
    return this.experienceLevelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um nível de experiência' })
  @ApiOkResponse({ description: 'Nível de experiência atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateExperienceLevelDto: UpdateExperienceLevelDto) {
    return this.experienceLevelService.update(id, updateExperienceLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um nível de experiência' })
  @ApiOkResponse({ description: 'Nível de experiência removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.experienceLevelService.remove(id);
  }
}
