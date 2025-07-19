// src/client-profile/client-profile.controller.ts
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

import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClientProfileService } from './clients.service';

@ApiTags('Client Profiles')
@Controller('clients')
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo perfil de cliente' })
  create(@Body() dto: CreateClientProfileDto) {
    return this.clientProfileService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista clientes com paginação' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'Isaac' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search?: string) {
    return this.clientProfileService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de um cliente' })
  findOne(@Param('id') id: string) {
    return this.clientProfileService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados de um cliente' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateClientProfileDto>) {
    return this.clientProfileService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cliente' })
  remove(@Param('id') id: string) {
    return this.clientProfileService.remove(id);
  }
}
