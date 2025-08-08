// src/marital-status/marital-status.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateMaritalStatusDto } from './dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from './dto/update-marital-status.dto';

import { MaritalStatus, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class MaritalStatusService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo estado civil no banco de dados.
   * @param createMaritalStatusDto O DTO com os dados para criar o estado civil.
   * @returns O estado civil recém-criado.
   */
  async create(createMaritalStatusDto: CreateMaritalStatusDto) {
    return this.prisma.maritalStatus.create({ data: createMaritalStatusDto });
  }

  /**
   * Retorna uma lista paginada de estados civis, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de estados civis, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<MaritalStatus>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MaritalStatusWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [statuses, total] = await this.prisma.$transaction([
      this.prisma.maritalStatus.findMany({ skip, take: limit, where }),
      this.prisma.maritalStatus.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: statuses,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todos os estados civis, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<MaritalStatus[]> {
    return this.prisma.maritalStatus.findMany();
  }

  /**
   * Encontra um estado civil específico pelo seu ID.
   * @param id O ID do estado civil (UUID em string).
   * @returns O estado civil encontrado.
   * @throws NotFoundException se o estado civil não for encontrado.
   */
  async findOne(id: string) {
    const status = await this.prisma.maritalStatus.findUnique({ where: { id } });
    if (!status) {
      throw new NotFoundException(`Marital Status with ID "${id}" not found`);
    }
    return status;
  }

  /**
   * Atualiza um estado civil existente.
   * @param id O ID do estado civil a ser atualizado (UUID em string).
   * @param updateMaritalStatusDto O DTO com os dados a serem atualizados.
   * @returns O estado civil atualizado.
   * @throws NotFoundException se o estado civil não for encontrado.
   */
  async update(id: string, updateMaritalStatusDto: UpdateMaritalStatusDto) {
    try {
      return await this.prisma.maritalStatus.update({ where: { id }, data: updateMaritalStatusDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Marital Status with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um estado civil do banco de dados.
   * @param id O ID do estado civil a ser removido (UUID em string).
   * @returns O estado civil que foi removido.
   * @throws NotFoundException se o estado civil não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.maritalStatus.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Marital Status with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
