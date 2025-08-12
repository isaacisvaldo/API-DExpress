// src/sector/sector.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service'; // Supondo que a importação esteja em 'src/common/prisma'
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Sector, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class SectorService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Cria um novo setor.
   * @param createDto DTO com os dados para criação do setor.
   * @returns O setor criado.
   * @throws BadRequestException se o nome do setor já existir.
   */
  async create(createDto: CreateSectorDto): Promise<Sector> {
    const existingSector = await this.prisma.sector.findUnique({
      where: { name: createDto.name },
    });

    if (existingSector) {
      throw new BadRequestException(`O setor com o nome '${createDto.name}' já existe.`);
    }
    
    return this.prisma.sector.create({
      data: createDto,
    });
  }

  /**
   * Lista todos os setores com paginação e pesquisa.
   * @param query DTO com os parâmetros de paginação e pesquisa.
   * @returns Um objeto PaginatedDto com os setores.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Sector>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SectorWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [sectors, total] = await this.prisma.$transaction([
      this.prisma.sector.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sector.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: sectors,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retorna uma lista simples de todos os setores (sem paginação).
   * Útil para preencher dropdowns e menus de seleção.
   * @returns Um array com todos os setores.
   */
  async findAllList(): Promise<Sector[]> {
    return this.prisma.sector.findMany({
      orderBy: { label: 'asc' },
    });
  }

  /**
   * Busca um setor por ID.
   * @param id O ID do setor.
   * @returns O setor encontrado.
   * @throws NotFoundException se o setor não for encontrado.
   */
  async findOne(id: string): Promise<Sector> {
    const sector = await this.prisma.sector.findUnique({
      where: { id },
    });

    if (!sector) {
      throw new NotFoundException(`Setor com o ID "${id}" não encontrado.`);
    }

    return sector;
  }

  /**
   * Atualiza um setor por ID.
   * @param id O ID do setor.
   * @param updateDto DTO com os dados de atualização.
   * @returns O setor atualizado.
   * @throws NotFoundException se o setor não for encontrado.
   * @throws BadRequestException se o nome do setor já estiver em uso.
   */
  async update(id: string, updateDto: UpdateSectorDto): Promise<Sector> {
    try {
      // Verifica se o novo nome já existe e não pertence ao setor atual
      if (updateDto.name) {
        const existingSector = await this.prisma.sector.findUnique({
          where: { name: updateDto.name },
        });
        if (existingSector && existingSector.id !== id) {
          throw new BadRequestException(`O nome do setor "${updateDto.name}" já está em uso.`);
        }
      }

      return await this.prisma.sector.update({
        where: { id },
        data: updateDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Setor com o ID "${id}" não encontrado.`);
      }
      throw error;
    }
  }

  /**
   * Remove um setor por ID.
   * @param id O ID do setor.
   * @returns O setor removido.
   * @throws NotFoundException se o setor não for encontrado.
   */
  async remove(id: string): Promise<Sector> {
    try {
      return await this.prisma.sector.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Setor com o ID "${id}" não encontrado.`);
        }
      }
      throw error;
    }
  }
}