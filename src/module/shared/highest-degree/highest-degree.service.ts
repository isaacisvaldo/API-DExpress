// src/highest-degree/highest-degree.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateHighestDegreeDto } from './dto/create-highest-degree.dto';
import { UpdateHighestDegreeDto } from './dto/update-highest-degree.dto';

import { HighestDegree, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class HighestDegreeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo nível de escolaridade no banco de dados.
   * @param createHighestDegreeDto O DTO com os dados para criar o nível.
   * @returns O nível de escolaridade recém-criado.
   */
  async create(createHighestDegreeDto: CreateHighestDegreeDto) {
    return this.prisma.highestDegree.create({ data: createHighestDegreeDto });
  }

  /**
   * Retorna uma lista paginada de níveis de escolaridade, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de níveis, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<HighestDegree>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.HighestDegreeWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [degrees, total] = await this.prisma.$transaction([
      this.prisma.highestDegree.findMany({ skip, take: limit, where }),
      this.prisma.highestDegree.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: degrees,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todos os níveis de escolaridade, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<HighestDegree[]> {
    return this.prisma.highestDegree.findMany();
  }

  /**
   * Encontra um nível de escolaridade específico pelo seu ID.
   * @param id O ID do nível (UUID em string).
   * @returns O nível encontrado.
   * @throws NotFoundException se o nível não for encontrado.
   */
  async findOne(id: string) {
    const degree = await this.prisma.highestDegree.findUnique({ where: { id } });
    if (!degree) {
      throw new NotFoundException(`Highest Degree with ID "${id}" not found`);
    }
    return degree;
  }

  /**
   * Atualiza um nível de escolaridade existente.
   * @param id O ID do nível a ser atualizado (UUID em string).
   * @param updateHighestDegreeDto O DTO com os dados a serem atualizados.
   * @returns O nível de escolaridade atualizado.
   * @throws NotFoundException se o nível não for encontrado.
   */
  async update(id: string, updateHighestDegreeDto: UpdateHighestDegreeDto) {
    try {
      return await this.prisma.highestDegree.update({ where: { id }, data: updateHighestDegreeDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Highest Degree with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um nível de escolaridade do banco de dados.
   * @param id O ID do nível a ser removido (UUID em string).
   * @returns O nível de escolaridade que foi removido.
   * @throws NotFoundException se o nível não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.highestDegree.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Highest Degree with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
