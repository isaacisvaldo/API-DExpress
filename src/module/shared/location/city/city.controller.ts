// src/city/city.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { City } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova cidade' })
  @ApiResponse({ status: 201, description: 'Cidade criada com sucesso.' })
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as cidades com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de cidades paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<City>> {
    return this.cityService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todas as cidades para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todas as cidades.' })
  findAllForFrontend(): Promise<City[]> {
    return this.cityService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma cidade pelo ID' })
  @ApiOkResponse({ description: 'Cidade encontrada.' })
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma cidade' })
  @ApiOkResponse({ description: 'Cidade atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma cidade' })
  @ApiOkResponse({ description: 'Cidade removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}
