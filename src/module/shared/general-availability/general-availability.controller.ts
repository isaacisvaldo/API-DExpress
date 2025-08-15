// src/module/shared/general-availability/general-availability.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeneralAvailabilityService } from './general-availability.service';
import { CreateGeneralAvailabilityDto } from './dto/create-general-availability.dto';
import { UpdateGeneralAvailabilityDto } from './dto/update-general-availability.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { GeneralAvailability } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('General Availabilities')
@Controller('general-availabilities')
export class GeneralAvailabilityController {
  constructor(private readonly generalAvailabilityService: GeneralAvailabilityService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova disponibilidade geral' })
  @ApiResponse({ status: 201, description: 'Disponibilidade geral criada com sucesso.' })
  create(@Body() createGeneralAvailabilityDto: CreateGeneralAvailabilityDto) {
    return this.generalAvailabilityService.create(createGeneralAvailabilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as disponibilidades gerais com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de disponibilidades gerais paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<GeneralAvailability>> {
    return this.generalAvailabilityService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todas as disponibilidades gerais para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todas as disponibilidades gerais.' })
  findAllForFrontend(): Promise<GeneralAvailability[]> {
    return this.generalAvailabilityService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma disponibilidade geral pelo ID' })
  @ApiOkResponse({ description: 'Disponibilidade geral encontrada.' })
  findOne(@Param('id') id: string) {
    return this.generalAvailabilityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma disponibilidade geral' })
  @ApiOkResponse({ description: 'Disponibilidade geral atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateGeneralAvailabilityDto: UpdateGeneralAvailabilityDto) {
    return this.generalAvailabilityService.update(id, updateGeneralAvailabilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma disponibilidade geral' })
  @ApiOkResponse({ description: 'Disponibilidade geral removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.generalAvailabilityService.remove(id);
  }
}
