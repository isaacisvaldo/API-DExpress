// src/skill/skill.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova habilidade no banco de dados.
   * @param createSkillDto O DTO com os dados para criar a habilidade.
   * @returns A habilidade recém-criada.
   */
  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({ data: createSkillDto });
  }

  /**
   * Retorna uma lista paginada de habilidades, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de habilidades, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Skill>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SkillWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [skills, total] = await this.prisma.$transaction([
      this.prisma.skill.findMany({ skip, take: limit, where }),
      this.prisma.skill.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: skills,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todas as habilidades, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Skill[]> {
    return this.prisma.skill.findMany();
  }

  /**
   * Encontra uma habilidade específica pelo seu ID.
   * @param id O ID da habilidade (UUID em string).
   * @returns A habilidade encontrada.
   * @throws NotFoundException se a habilidade não for encontrada.
   */
  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found`);
    }
    return skill;
  }

  /**
   * Atualiza uma habilidade existente.
   * @param id O ID da habilidade a ser atualizada (UUID em string).
   * @param updateSkillDto O DTO com os dados a serem atualizados.
   * @returns A habilidade atualizada.
   * @throws NotFoundException se a habilidade não for encontrada.
   */
  async update(id: string, updateSkillDto: UpdateSkillDto) {
    try {
      return await this.prisma.skill.update({ where: { id }, data: updateSkillDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Skill with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove uma habilidade do banco de dados.
   * @param id O ID da habilidade a ser removida (UUID em string).
   * @returns A habilidade que foi removida.
   * @throws NotFoundException se a habilidade não for encontrada.
   */
  async remove(id: string) {
    try {
      return await this.prisma.skill.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Skill with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
