// src/professional/professional.controller.ts
import { Controller, Post, Body, Get, Query, UseInterceptors } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { TranslateProfessionalPipe } from 'src/common/pipes/translate-professional.pipe';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.create(createProfessionalDto);
  }
@UseInterceptors(TranslateProfessionalPipe)
  @Get()
  findByFilters(@Query() filters: FilterProfessionalDto) {
    return this.professionalService.findByFilters(filters);
  }

    @Post('availability')
  addAvailability(@Body() dto: CreateAvailabilityDto) {
    return this.professionalService.addAvailability(dto);
  }
}
