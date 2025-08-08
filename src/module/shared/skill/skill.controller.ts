// src/skill/skill.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { Skill } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova habilidade' })
  @ApiResponse({ status: 201, description: 'Habilidade criada com sucesso.' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as habilidades com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de habilidades paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Skill>> {
    return this.skillService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todas as habilidades para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todas as habilidades.' })
  findAllForFrontend(): Promise<Skill[]> {
    return this.skillService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma habilidade pelo ID' })
  @ApiOkResponse({ description: 'Habilidade encontrada.' })
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma habilidade' })
  @ApiOkResponse({ description: 'Habilidade atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma habilidade' })
  @ApiOkResponse({ description: 'Habilidade removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
