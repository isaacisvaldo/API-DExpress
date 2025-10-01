// src/audit-log/audit-log.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuditLog, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo log de auditoria no banco de dados.
   */

  /**
   * Cria um novo log de auditoria
   */
  async createLog(params: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    requestMethod?: string;
    requestUrl?: string;
    requestBody?: any;     // JSON
    previousData?: any;    // JSON
    newData?: any;         // JSON
    status?: string;       // SUCCESS, FAILURE, ERROR
    source?: string;       // SYSTEM, USER, CRON_JOB, API
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        description: params.description,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        requestMethod: params.requestMethod,
        requestUrl: params.requestUrl,
        requestBody: params.requestBody,
        previousData: params.previousData,
        newData: params.newData,
        status: params.status ?? 'SUCCESS',
        source: params.source ?? 'USER',
      },
    });
  }

  /**
   * Lista logs com paginação e filtros opcionais.
   * @param query DTO de paginação e pesquisa.
   */
  async findAll(query: FindAllDto & {
    userId?: string;
    action?: string;
    entity?: string;
    status?: string;
    source?: string;
  }): Promise<PaginatedDto<AuditLog>> {
  
const page = query.page ? Number(query.page) : 1;
const limit = query.limit ? Number(query.limit) : 10;
const skip = (page - 1) * limit;


    const where: Prisma.AuditLogWhereInput = {
      AND: [
        query.search
          ? {
              OR: [
                { action: { contains: query.search, mode: 'insensitive' } },
                { entity: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {},
        query.userId ? { userId: query.userId } : {},
        query.action ? { action: query.action } : {},
        query.entity ? { entity: query.entity } : {},
        query.status ? { status: query.status } : {},
        query.source ? { source: query.source } : {},
      ],
    };

    const [logs, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna um log específico pelo ID.
   */
  async findOne(id: string): Promise<AuditLog> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!log) {
      throw new NotFoundException(`AuditLog with ID "${id}" not found`);
    }

    return log;
  }

  /**
   * Marca um log como revisado.
   */
  async markAsRead(id: string): Promise<AuditLog> {
    try {
      return await this.prisma.auditLog.update({
        where: { id },
        data: { read: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`AuditLog with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove logs mais antigos que uma determinada data.
   */
  async deleteOlderThan(date: Date): Promise<{ count: number }> {
    return this.prisma.auditLog.deleteMany({
      where: { createdAt: { lt: date } },
    });
  }
  async deleteAuditLog(id: string): Promise<void> {
    await this.prisma.auditLog.delete({
      where: { id },
    });
  }
}
