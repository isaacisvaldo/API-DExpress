import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { TranslateProfessionalPipe } from 'src/common/pipes/translate-professional.pipe';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@ApiTags('PROFISSIONAL')
@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo profissional' })
  @ApiResponse({ status: 201, description: 'Profissional cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateProfessionalDto })
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.create(createProfessionalDto);
  }

  @UseInterceptors(TranslateProfessionalPipe)
  @Get()
  @ApiOperation({ summary: 'Buscar profissionais com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de profissionais filtrados' })
  findByFilters(@Query() filters: FilterProfessionalDto) {
    return this.professionalService.findByFilters(filters);
  }

  @Post('availability')
  @ApiOperation({ summary: 'Adicionar disponibilidade ao profissional' })
  @ApiResponse({ status: 201, description: 'Disponibilidade adicionada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos para disponibilidade' })
  @ApiBody({ type: CreateAvailabilityDto })
  addAvailability(@Body() dto: CreateAvailabilityDto) {
    return this.professionalService.addAvailability(dto);
  }
}
