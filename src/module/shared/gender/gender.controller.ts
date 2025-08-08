// src/gender/gender.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';



@ApiTags('Genders')
@Controller('genders')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo gênero' })
  @ApiResponse({ status: 201, description: 'Gênero criado com sucesso.' })
  create(@Body() createGenderDto: CreateGenderDto) {
    return this.genderService.create(createGenderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os gêneros com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de gêneros paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Gender>> {
    return this.genderService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os gêneros para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todos os gêneros.' })
  findAllForFrontend(): Promise<Gender[]> {
    return this.genderService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um gênero pelo ID' })
  @ApiOkResponse({ description: 'Gênero encontrado.' })
  findOne(@Param('id') id: string) {
    return this.genderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um gênero' })
  @ApiOkResponse({ description: 'Gênero atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.genderService.update(id, updateGenderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um gênero' })
  @ApiOkResponse({ description: 'Gênero removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.genderService.remove(id);
  }
}
