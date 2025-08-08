// src/location/location.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

import { Location, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova localização no banco de dados.
   * @param createLocationDto O DTO com os dados para criar a localização.
   * @returns A localização recém-criada.
   */
  async create(createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({ data: createLocationDto });
  }

  /**
   * Retorna uma lista paginada de localizações, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de localizações, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Location>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.LocationWhereInput = query.search
      ? {
          OR: [
            { street: { contains: query.search, mode: 'insensitive' } },
            { city: { name: { contains: query.search, mode: 'insensitive' } } },
            { district: { name: { contains: query.search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const [locations, total] = await this.prisma.$transaction([
      this.prisma.location.findMany({ skip, take: limit, where }),
      this.prisma.location.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: locations,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as localizações, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Location[]> {
    return this.prisma.location.findMany();
  }

  /**
   * Encontra uma localização específica pelo seu ID.
   * @param id O ID da localização (UUID em string).
   * @returns A localização encontrada.
   * @throws NotFoundException se a localização não for encontrada.
   */
  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location with ID "${id}" not found`);
    }
    return location;
  }

  /**
   * Atualiza uma localização existente.
   * @param id O ID da localização a ser atualizada (UUID em string).
   * @param updateLocationDto O DTO com os dados a serem atualizados.
   * @returns A localização atualizada.
   * @throws NotFoundException se a localização não for encontrada.
   */
  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      return await this.prisma.location.update({ where: { id }, data: updateLocationDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Location with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma localização do banco de dados.
   * @param id O ID da localização a ser removida (UUID em string).
   * @returns A localização que foi removida.
   * @throws NotFoundException se a localização não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.location.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Location with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
