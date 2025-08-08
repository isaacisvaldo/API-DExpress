// src/specialty/specialty.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

import { Specialty, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova especialidade no banco de dados.
   * @param createSpecialtyDto O DTO com os dados para criar a especialidade.
   * @returns A especialidade recém-criada.
   */
  async create(createSpecialtyDto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({ data: createSpecialtyDto });
  }

  /**
   * Retorna uma lista paginada de especialidades, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de especialidades, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Specialty>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SpecialtyWhereInput = query.search
      ? {
          name: { contains: query.search, mode: 'insensitive' },
        }
      : {};

    const [specialties, total] = await this.prisma.$transaction([
      this.prisma.specialty.findMany({ skip, take: limit, where }),
      this.prisma.specialty.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: specialties,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as especialidades, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Specialty[]> {
    return this.prisma.specialty.findMany();
  }

  /**
   * Encontra uma especialidade específica pelo seu ID.
   * @param id O ID da especialidade (UUID em string).
   * @returns A especialidade encontrada.
   * @throws NotFoundException se a especialidade não for encontrada.
   */
  async findOne(id: string) {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID "${id}" not found`);
    }
    return specialty;
  }

  /**
   * Atualiza uma especialidade existente.
   * @param id O ID da especialidade a ser atualizada (UUID em string).
   * @param updateSpecialtyDto O DTO com os dados a serem atualizados.
   * @returns A especialidade atualizada.
   * @throws NotFoundException se a especialidade não for encontrada.
   */
  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {
    try {
      return await this.prisma.specialty.update({ where: { id }, data: updateSpecialtyDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Specialty with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma especialidade do banco de dados.
   * @param id O ID da especialidade a ser removida (UUID em string).
   * @returns A especialidade que foi removida.
   * @throws NotFoundException se a especialidade não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.specialty.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Specialty with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
