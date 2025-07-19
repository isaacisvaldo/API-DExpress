// src/company-profile/company-profile.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';

import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CompanyProfileService } from './company.service';

@ApiTags('Company Profiles')
@Controller('companies')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo perfil de empresa' })
  create(@Body() dto: CreateCompanyProfileDto) {
    return this.companyProfileService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista empresas com paginação' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'DExpress' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search?: string) {
    return this.companyProfileService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de uma empresa' })
  findOne(@Param('id') id: string) {
    return this.companyProfileService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados de uma empresa' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCompanyProfileDto>) {
    return this.companyProfileService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma empresa' })
  remove(@Param('id') id: string) {
    return this.companyProfileService.remove(id);
  }
}
