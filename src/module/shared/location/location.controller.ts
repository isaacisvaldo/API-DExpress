// src/location/location.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { Location } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova localização' })
  @ApiResponse({ status: 201, description: 'Localização criada com sucesso.' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as localizações com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de localizações paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Location>> {
    return this.locationService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todas as localizações para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todas as localizações.' })
  findAllForFrontend(): Promise<Location[]> {
    return this.locationService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma localização pelo ID' })
  @ApiOkResponse({ description: 'Localização encontrada.' })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma localização' })
  @ApiOkResponse({ description: 'Localização atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma localização' })
  @ApiOkResponse({ description: 'Localização removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}
