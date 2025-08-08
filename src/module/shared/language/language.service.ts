// src/language/language.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo idioma no banco de dados.
   * @param createLanguageDto O DTO com os dados para criar o idioma.
   * @returns O idioma recém-criado.
   */
  async create(createLanguageDto: CreateLanguageDto) {
    return this.prisma.language.create({ data: createLanguageDto });
  }

  /**
   * Retorna uma lista paginada de idiomas, com a opção de pesquisa.
   * @param query O DTO com os parâmetros de consulta para paginação e pesquisa.
   * @returns Um objeto com a lista de idiomas, a contagem total, a página atual e o limite.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Language>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.LanguageWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [languages, total] = await this.prisma.$transaction([
      this.prisma.language.findMany({ skip, take: limit, where }),
      this.prisma.language.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: languages,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista completa de todos os idiomas, sem paginação.
   * Ideal para ser usado em dropdowns e seletores em formulários.
   */
  async findAllForFrontend(): Promise<Language[]> {
    return this.prisma.language.findMany();
  }

  /**
   * Encontra um idioma específico pelo seu ID.
   * @param id O ID do idioma (UUID em string).
   * @returns O idioma encontrado.
   * @throws NotFoundException se o idioma não for encontrado.
   */
  async findOne(id: string) {
    const language = await this.prisma.language.findUnique({ where: { id } });
    if (!language) {
      throw new NotFoundException(`Language with ID "${id}" not found`);
    }
    return language;
  }

  /**
   * Atualiza um idioma existente.
   * @param id O ID do idioma a ser atualizado (UUID em string).
   * @param updateLanguageDto O DTO com os dados a serem atualizados.
   * @returns O idioma atualizado.
   * @throws NotFoundException se o idioma não for encontrado.
   */
  async update(id: string, updateLanguageDto: UpdateLanguageDto) {
    try {
      return await this.prisma.language.update({ where: { id }, data: updateLanguageDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Language with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um idioma do banco de dados.
   * @param id O ID do idioma a ser removido (UUID em string).
   * @returns O idioma que foi removido.
   * @throws NotFoundException se o idioma não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.language.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Language with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
