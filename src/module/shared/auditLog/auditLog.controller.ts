// src/audit-log/audit-log.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuditLog } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { AuditLogService } from './auditLog.service';

@ApiTags('Audit Logs')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}
/*
  @Post()
  @ApiOperation({ summary: 'Cria um novo log de auditoria' })
  @ApiResponse({ status: 201, description: 'Log de auditoria criado com sucesso.' })
  create(@Body() data: any): Promise<AuditLog> {
    return this.auditLogService.createLog(data);
  }
    */

  @Get()
  @ApiOperation({ summary: 'Lista todos os logs de auditoria com paginação e filtros' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de logs de auditoria paginada.' })
  findAll(
    @Query() query: FindAllDto & { userId?: string; action?: string; entity?: string; status?: string; source?: string },
  ): Promise<PaginatedDto<AuditLog>> {
    return this.auditLogService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um log de auditoria pelo ID' })
  @ApiOkResponse({ description: 'Log de auditoria encontrado.' })
  findOne(@Param('id') id: string): Promise<AuditLog> {
    return this.auditLogService.findOne(id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um log de auditoria pelo ID' })
  @ApiOkResponse({ description: 'Log de auditoria removido com sucesso.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.auditLogService.deleteAuditLog(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marca um log de auditoria como revisado' })
  @ApiOkResponse({ description: 'Log de auditoria marcado como revisado com sucesso.' })
  markAsRead(@Param('id') id: string): Promise<AuditLog> {
    return this.auditLogService.markAsRead(id);
  }

  @Delete('older-than/:date')
  @ApiOperation({ summary: 'Remove logs de auditoria mais antigos que a data informada' })
  @ApiOkResponse({ description: 'Logs de auditoria antigos removidos com sucesso.' })
  deleteOlderThan(@Param('date') date: string) {
    return this.auditLogService.deleteOlderThan(new Date(date));
  }
}
