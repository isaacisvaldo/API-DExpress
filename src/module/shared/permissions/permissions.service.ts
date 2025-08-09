// src/permissions/permissions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova permissão no banco de dados.
   * @param createPermissionDto O DTO com os dados para criar a permissão.
   * @returns A permissão recém-criada.
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.prisma.permission.create({ data: createPermissionDto });
  }

  /**
   * Retorna uma lista paginada de permissões, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de permissões, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Permission>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PermissionWhereInput = query.search
      ? {
          name: { contains: query.search, mode: 'insensitive' },
        }
      : {};

    const [permissions, total] = await this.prisma.$transaction([
      this.prisma.permission.findMany({ skip, take: limit, where }),
      this.prisma.permission.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: permissions,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as permissões, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  /**
   * Encontra uma permissão específica pelo seu ID.
   * @param id O ID da permissão (UUID em string).
   * @returns A permissão encontrada.
   * @throws NotFoundException se a permissão não for encontrada.
   */
  async findOne(id: string): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
    return permission;
  }

  /**
   * Atualiza uma permissão existente.
   * @param id O ID da permissão a ser atualizada (UUID em string).
   * @param updatePermissionDto O DTO com os dados a serem atualizados.
   * @returns A permissão atualizada.
   * @throws NotFoundException se a permissão não for encontrada.
   */
  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    try {
      return await this.prisma.permission.update({ where: { id }, data: updatePermissionDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Permission with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma permissão do banco de dados.
   * @param id O ID da permissão a ser removida (UUID em string).
   * @returns A permissão que foi removida.
   * @throws NotFoundException se a permissão não for encontrada.
   */
  async remove(id: string): Promise<Permission> {
    try {
      return await this.prisma.permission.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Permission with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
