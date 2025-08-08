// src/gender/gender.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { Gender, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class GenderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo gênero no banco de dados.
   * @param createGenderDto O DTO com os dados para criar o gênero.
   * @returns O gênero recém-criado.
   */
  async create(createGenderDto: CreateGenderDto) {
    return this.prisma.gender.create({ data: createGenderDto });
  }

  /**
   * Retorna uma lista paginada de gêneros, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de gêneros, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Gender>> {
     const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.GenderWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [genders, total] = await this.prisma.$transaction([
      this.prisma.gender.findMany({ skip, take: limit, where }),
      this.prisma.gender.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: genders,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todos os gêneros, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Gender[]> {
    return this.prisma.gender.findMany();
  }

  /**
   * Encontra um gênero específico pelo seu ID.
   * @param id O ID do gênero (UUID em string).
   * @returns O gênero encontrado.
   * @throws NotFoundException se o gênero não for encontrado.
   */
  async findOne(id: string) {
    const gender = await this.prisma.gender.findUnique({ where: { id } });
    if (!gender) {
      throw new NotFoundException(`Gender with ID "${id}" not found`);
    }
    return gender;
  }

  /**
   * Atualiza um gênero existente.
   * @param id O ID do gênero a ser atualizado (UUID em string).
   * @param updateGenderDto O DTO com os dados a serem atualizados.
   * @returns O gênero atualizado.
   * @throws NotFoundException se o gênero não for encontrado.
   */
  async update(id: string, updateGenderDto: UpdateGenderDto) {
    try {
      return await this.prisma.gender.update({ where: { id }, data: updateGenderDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gender with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um gênero do banco de dados.
   * @param id O ID do gênero a ser removido (UUID em string).
   * @returns O gênero que foi removido.
   * @throws NotFoundException se o gênero não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.gender.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Gender with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
