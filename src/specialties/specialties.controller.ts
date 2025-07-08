
// src/specialty/specialty.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';

import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SpecialtyService } from './specialties.service';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova especialidade' })
  @ApiBody({ type: CreateSpecialtyDto })
  create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as especialidades' })
  findAll() {
    return this.specialtyService.findAll();
  }
  }
