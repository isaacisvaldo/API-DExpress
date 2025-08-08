// src/module/shared/experience-level/experience-level.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
import { ExperienceLevel, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class ExperienceLevelService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo nível de experiência no banco de dados.
   * @param createExperienceLevelDto O DTO com os dados para criar o nível de experiência.
   * @returns O nível de experiência recém-criado.
   */
  async create(createExperienceLevelDto: CreateExperienceLevelDto) {
    return this.prisma.experienceLevel.create({ data: createExperienceLevelDto });
  }

  /**
   * Retorna uma lista paginada de níveis de experiência, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de níveis de experiência, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<ExperienceLevel>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ExperienceLevelWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [levels, total] = await this.prisma.$transaction([
      this.prisma.experienceLevel.findMany({ skip, take: limit, where }),
      this.prisma.experienceLevel.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: levels,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todos os níveis de experiência, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<ExperienceLevel[]> {
    return this.prisma.experienceLevel.findMany();
  }

  /**
   * Encontra um nível de experiência específico pelo seu ID.
   * @param id O ID do nível de experiência (UUID em string).
   * @returns O nível de experiência encontrado.
   * @throws NotFoundException se o nível de experiência não for encontrado.
   */
  async findOne(id: string) {
    const level = await this.prisma.experienceLevel.findUnique({ where: { id } });
    if (!level) {
      throw new NotFoundException(`Experience Level with ID "${id}" not found`);
    }
    return level;
  }

  /**
   * Atualiza um nível de experiência existente.
   * @param id O ID do nível de experiência a ser atualizado (UUID em string).
   * @param updateExperienceLevelDto O DTO com os dados a serem atualizados.
   * @returns O nível de experiência atualizado.
   * @throws NotFoundException se o nível de experiência não for encontrado.
   */
  async update(id: string, updateExperienceLevelDto: UpdateExperienceLevelDto) {
    try {
      return await this.prisma.experienceLevel.update({ where: { id }, data: updateExperienceLevelDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Experience Level with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um nível de experiência do banco de dados.
   * @param id O ID do nível de experiência a ser removido (UUID em string).
   * @returns O nível de experiência que foi removido.
   * @throws NotFoundException se o nível de experiência não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.experienceLevel.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Experience Level with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
