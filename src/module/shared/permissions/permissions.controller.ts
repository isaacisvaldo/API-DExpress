// src/permissions/permissions.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { Permission } from '@prisma/client';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova permissão' })
  @ApiResponse({ status: 201, description: 'A permissão foi criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtém uma lista paginada de permissões' })
  @ApiResponse({ status: 200, description: 'Retorna a lista de permissões.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Permission>> {
    return this.permissionsService.findAll(query);
  }

  @Get('list')
  @ApiOperation({ summary: 'Obtém todas as permissões para uso em dropdowns' })
  @ApiResponse({ status: 200, description: 'Retorna a lista completa de permissões.' })
  findAllForFrontend(): Promise<Permission[]> {
    return this.permissionsService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma permissão pelo ID' })
  @ApiResponse({ status: 200, description: 'Retorna a permissão encontrada.' })
  @ApiResponse({ status: 404, description: 'Permissão não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma permissão existente' })
  @ApiResponse({ status: 200, description: 'A permissão foi atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Permissão não encontrada.' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma permissão' })
  @ApiResponse({ status: 200, description: 'A permissão foi removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Permissão não encontrada.' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
