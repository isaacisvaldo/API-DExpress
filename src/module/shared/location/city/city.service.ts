// src/city/city.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

import { City, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova cidade no banco de dados.
   * @param createCityDto O DTO com os dados para criar a cidade.
   * @returns A cidade recém-criada.
   */
  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({ data: createCityDto });
  }

  /**
   * Retorna uma lista paginada de cidades, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de cidades, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<City>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CityWhereInput = query.search
      ? {
          name: { contains: query.search, mode: 'insensitive' },
        }
      : {};

    const [cities, total] = await this.prisma.$transaction([
      this.prisma.city.findMany({ skip, take: limit, where }),
      this.prisma.city.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: cities,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as cidades, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<City[]> {
    return this.prisma.city.findMany();
  }

  /**
   * Encontra uma cidade específica pelo seu ID.
   * @param id O ID da cidade (UUID em string).
   * @returns A cidade encontrada.
   * @throws NotFoundException se a cidade não for encontrada.
   */
  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City with ID "${id}" not found`);
    }
    return city;
  }

  /**
   * Atualiza uma cidade existente.
   * @param id O ID da cidade a ser atualizada (UUID em string).
   * @param updateCityDto O DTO com os dados a serem atualizados.
   * @returns A cidade atualizada.
   * @throws NotFoundException se a cidade não for encontrada.
   */
  async update(id: string, updateCityDto: UpdateCityDto) {
    try {
      return await this.prisma.city.update({ where: { id }, data: updateCityDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`City with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma cidade do banco de dados.
   * @param id O ID da cidade a ser removida (UUID em string).
   * @returns A cidade que foi removida.
   * @throws NotFoundException se a cidade não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.city.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`City with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
