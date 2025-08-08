// src/marital-status/marital-status.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MaritalStatusService } from './marital-status.service';
import { CreateMaritalStatusDto } from './dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from './dto/update-marital-status.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { MaritalStatus } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Marital Status')
@Controller('marital-statuses')
export class MaritalStatusController {
  constructor(private readonly maritalStatusService: MaritalStatusService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo estado civil' })
  @ApiResponse({ status: 201, description: 'Estado civil criado com sucesso.' })
  create(@Body() createMaritalStatusDto: CreateMaritalStatusDto) {
    return this.maritalStatusService.create(createMaritalStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os estados civis com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de estados civis paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<MaritalStatus>> {
    return this.maritalStatusService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os estados civis para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todos os estados civis.' })
  findAllForFrontend(): Promise<MaritalStatus[]> {
    return this.maritalStatusService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um estado civil pelo ID' })
  @ApiOkResponse({ description: 'Estado civil encontrado.' })
  findOne(@Param('id') id: string) {
    return this.maritalStatusService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um estado civil' })
  @ApiOkResponse({ description: 'Estado civil atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateMaritalStatusDto: UpdateMaritalStatusDto) {
    return this.maritalStatusService.update(id, updateMaritalStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um estado civil' })
  @ApiOkResponse({ description: 'Estado civil removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.maritalStatusService.remove(id);
  }
}
