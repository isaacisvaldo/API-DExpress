// src/district/district.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { District } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Districts')
@Controller('districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo distrito' })
  @ApiResponse({ status: 201, description: 'Distrito criado com sucesso.' })
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os distritos com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de distritos paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<District>> {
    return this.districtService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os distritos para uso em formulários' })
  @ApiOkResponse({ description: 'Lista completa de todos os distritos.' })
  findAllForFrontend(): Promise<District[]> {
    return this.districtService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um distrito pelo ID' })
  @ApiOkResponse({ description: 'Distrito encontrado.' })
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um distrito' })
  @ApiOkResponse({ description: 'Distrito atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um distrito' })
  @ApiOkResponse({ description: 'Distrito removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.districtService.remove(id);
  }
}
