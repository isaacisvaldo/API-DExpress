// src/language/language.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

import { Language } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo idioma' })
  @ApiResponse({ status: 201, description: 'Idioma criado com sucesso.' })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os idiomas com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de idiomas paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Language>> {
    return this.languageService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os idiomas para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todos os idiomas.' })
  findAllForFrontend(): Promise<Language[]> {
    return this.languageService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um idioma pelo ID' })
  @ApiOkResponse({ description: 'Idioma encontrado.' })
  findOne(@Param('id') id: string) {
    return this.languageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um idioma' })
  @ApiOkResponse({ description: 'Idioma atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um idioma' })
  @ApiOkResponse({ description: 'Idioma removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.languageService.remove(id);
  }
}
