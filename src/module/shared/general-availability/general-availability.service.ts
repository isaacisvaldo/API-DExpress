// src/module/shared/general-availability/general-availability.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGeneralAvailabilityDto } from './dto/create-general-availability.dto';
import { UpdateGeneralAvailabilityDto } from './dto/update-general-availability.dto';
import { GeneralAvailability, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class GeneralAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova disponibilidade geral no banco de dados.
   * @param createGeneralAvailabilityDto O DTO com os dados para criar a disponibilidade.
   * @returns A disponibilidade recém-criada.
   */
  async create(createGeneralAvailabilityDto: CreateGeneralAvailabilityDto) {
    return this.prisma.generalAvailability.create({ data: createGeneralAvailabilityDto });
  }

  /**
   * Retorna uma lista paginada de disponibilidades gerais, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de disponibilidades, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<GeneralAvailability>> {
   const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.GeneralAvailabilityWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [availabilities, total] = await this.prisma.$transaction([
      this.prisma.generalAvailability.findMany({ skip, take: limit, where }),
      this.prisma.generalAvailability.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: availabilities,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as disponibilidades gerais, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<GeneralAvailability[]> {
    return this.prisma.generalAvailability.findMany();
  }

  /**
   * Encontra uma disponibilidade geral específica pelo seu ID.
   * @param id O ID da disponibilidade (UUID em string).
   * @returns A disponibilidade encontrada.
   * @throws NotFoundException se a disponibilidade não for encontrada.
   */
  async findOne(id: string) {
    const availability = await this.prisma.generalAvailability.findUnique({ where: { id } });
    if (!availability) {
      throw new NotFoundException(`General Availability with ID "${id}" not found`);
    }
    return availability;
  }

  /**
   * Atualiza uma disponibilidade geral existente.
   * @param id O ID da disponibilidade a ser atualizada (UUID em string).
   * @param updateGeneralAvailabilityDto O DTO com os dados a serem atualizados.
   * @returns A disponibilidade atualizada.
   * @throws NotFoundException se a disponibilidade não for encontrada.
   */
  async update(id: string, updateGeneralAvailabilityDto: UpdateGeneralAvailabilityDto) {
    try {
      return await this.prisma.generalAvailability.update({ where: { id }, data: updateGeneralAvailabilityDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`General Availability with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma disponibilidade geral do banco de dados.
   * @param id O ID da disponibilidade a ser removida (UUID em string).
   * @returns A disponibilidade que foi removida.
   * @throws NotFoundException se a disponibilidade não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.generalAvailability.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`General Availability with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
