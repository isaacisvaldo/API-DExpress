// src/desired-position/desired-position.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DesiredPositionService } from './desired-position.service';
import { CreateDesiredPositionDto } from './dto/create-desired-position.dto';
import { UpdateDesiredPositionDto } from './dto/update-desired-position.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { DesiredPosition } from '@prisma/client';


@ApiTags('Desired Positions')
@Controller('desired-positions')
export class DesiredPositionController {
  constructor(private readonly desiredPositionService: DesiredPositionService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova posição desejada' })
  @ApiResponse({ status: 201, description: 'Posição desejada criada com sucesso.' })
  create(@Body() createDesiredPositionDto: CreateDesiredPositionDto) {
    return this.desiredPositionService.create(createDesiredPositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as posições desejadas com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de posições desejadas paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<DesiredPosition>> {
    return this.desiredPositionService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todas as posições desejadas para uso em formulários' })
  @ApiOkResponse({ description: 'Lista completa de todas as posições desejadas.' })
  findAllForFrontend(): Promise<DesiredPosition[]> {
    return this.desiredPositionService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma posição desejada pelo ID' })
  @ApiOkResponse({ description: 'Posição desejada encontrada.' })
  findOne(@Param('id') id: string) {
    return this.desiredPositionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma posição desejada' })
  @ApiOkResponse({ description: 'Posição desejada atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateDesiredPositionDto: UpdateDesiredPositionDto) {
    return this.desiredPositionService.update(id, updateDesiredPositionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma posição desejada' })
  @ApiOkResponse({ description: 'Posição desejada removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.desiredPositionService.remove(id);
  }
}
