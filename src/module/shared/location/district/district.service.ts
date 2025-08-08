// src/district/district.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo distrito no banco de dados.
   * @param createDistrictDto O DTO com os dados para criar o distrito.
   * @returns O distrito recém-criado.
   */
  async create(createDistrictDto: CreateDistrictDto) {
    return this.prisma.district.create({ data: createDistrictDto });
  }

  /**
   * Retorna uma lista paginada de distritos, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de distritos, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<District>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DistrictWhereInput = query.search
      ? {
          name: { contains: query.search, mode: 'insensitive' },
        }
      : {};

    const [districts, total] = await this.prisma.$transaction([
      this.prisma.district.findMany({ skip, take: limit, where }),
      this.prisma.district.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: districts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todos os distritos, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<District[]> {
    return this.prisma.district.findMany();
  }

  /**
   * Encontra um distrito específico pelo seu ID.
   * @param id O ID do distrito (UUID em string).
   * @returns O distrito encontrado.
   * @throws NotFoundException se o distrito não for encontrado.
   */
  async findOne(id: string) {
    const district = await this.prisma.district.findUnique({ where: { id } });
    if (!district) {
      throw new NotFoundException(`District with ID "${id}" not found`);
    }
    return district;
  }

  /**
   * Atualiza um distrito existente.
   * @param id O ID do distrito a ser atualizado (UUID em string).
   * @param updateDistrictDto O DTO com os dados a serem atualizados.
   * @returns O distrito atualizado.
   * @throws NotFoundException se o distrito não for encontrado.
   */
  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    try {
      return await this.prisma.district.update({ where: { id }, data: updateDistrictDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`District with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um distrito do banco de dados.
   * @param id O ID do distrito a ser removido (UUID em string).
   * @returns O distrito que foi removido.
   * @throws NotFoundException se o distrito não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.district.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`District with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
