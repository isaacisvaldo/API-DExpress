// src/highest-degree/highest-degree.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HighestDegreeService } from './highest-degree.service';
import { CreateHighestDegreeDto } from './dto/create-highest-degree.dto';
import { UpdateHighestDegreeDto } from './dto/update-highest-degree.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { HighestDegree } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Highest Degrees')
@Controller('highest-degrees')
export class HighestDegreeController {
  constructor(private readonly highestDegreeService: HighestDegreeService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo nível de escolaridade' })
  @ApiResponse({ status: 201, description: 'Nível de escolaridade criado com sucesso.' })
  create(@Body() createHighestDegreeDto: CreateHighestDegreeDto) {
    return this.highestDegreeService.create(createHighestDegreeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os níveis de escolaridade com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de níveis de escolaridade paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<HighestDegree>> {
    return this.highestDegreeService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os níveis de escolaridade para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todos os níveis de escolaridade.' })
  findAllForFrontend(): Promise<HighestDegree[]> {
    return this.highestDegreeService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um nível de escolaridade pelo ID' })
  @ApiOkResponse({ description: 'Nível de escolaridade encontrado.' })
  findOne(@Param('id') id: string) {
    return this.highestDegreeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um nível de escolaridade' })
  @ApiOkResponse({ description: 'Nível de escolaridade atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateHighestDegreeDto: UpdateHighestDegreeDto) {
    return this.highestDegreeService.update(id, updateHighestDegreeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um nível de escolaridade' })
  @ApiOkResponse({ description: 'Nível de escolaridade removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.highestDegreeService.remove(id);
  }
}
