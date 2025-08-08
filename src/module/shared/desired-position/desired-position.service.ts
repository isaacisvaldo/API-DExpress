// src/desired-position/desired-position.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDesiredPositionDto } from './dto/create-desired-position.dto';
import { UpdateDesiredPositionDto } from './dto/update-desired-position.dto';
import { DesiredPosition, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class DesiredPositionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova posição desejada no banco de dados.
   * @param createDesiredPositionDto O DTO com os dados para criar a posição.
   * @returns A posição desejada recém-criada.
   */
  async create(createDesiredPositionDto: CreateDesiredPositionDto) {
    return this.prisma.desiredPosition.create({ data: createDesiredPositionDto });
  }

  

  /**
   * Retorna uma lista paginada de posições desejadas, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de posições, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<DesiredPosition>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DesiredPositionWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [positions, total] = await this.prisma.$transaction([
      this.prisma.desiredPosition.findMany({ skip, take: limit, where }),
      this.prisma.desiredPosition.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: positions,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as posições desejadas, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<DesiredPosition[]> {
    return this.prisma.desiredPosition.findMany();
  }

  /**
   * Encontra uma posição desejada específica pelo seu ID.
   * @param id O ID da posição (UUID em string).
   * @returns A posição encontrada.
   * @throws NotFoundException se a posição não for encontrada.
   */
  async findOne(id: string) {
    const position = await this.prisma.desiredPosition.findUnique({ where: { id } });
    if (!position) {
      throw new NotFoundException(`Desired Position with ID "${id}" not found`);
    }
    return position;
  }

  /**
   * Atualiza uma posição desejada existente.
   * @param id O ID da posição a ser atualizada (UUID em string).
   * @param updateDesiredPositionDto O DTO com os dados a serem atualizados.
   * @returns A posição desejada atualizada.
   * @throws NotFoundException se a posição não for encontrada.
   */
  async update(id: string, updateDesiredPositionDto: UpdateDesiredPositionDto) {
    try {
      return await this.prisma.desiredPosition.update({ where: { id }, data: updateDesiredPositionDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Desired Position with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma posição desejada do banco de dados.
   * @param id O ID da posição a ser removida (UUID em string).
   * @returns A posição desejada que foi removida.
   * @throws NotFoundException se a posição não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.desiredPosition.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Desired Position with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
