import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { Package, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    return this.prisma.package.create({ data: createPackageDto });
  }

  /**
   * Retorna uma lista paginada de pacotes, com a opção de pesquisa.
   */
  async findAll(query: FindAllDto): Promise<PaginatedDto<Package>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PackageWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [packages, total] = await this.prisma.$transaction([
      this.prisma.package.findMany({ skip, take: limit, where }),
      this.prisma.package.count({ where }),
    ]);

    // Cálculo do total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      data: packages,
      total,
      page,
      limit,
      totalPages,
    };
  }
  /**
   * Retorna uma lista completa de todos os pacotes, sem paginação.
   * Útil para preencher campos de seleção ou listas.
   */
  async findAllForFrontend(): Promise<Package[]> {
    return this.prisma.package.findMany();
  }
  async findOne(id: string): Promise<Package> {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Package with ID "${id}" not found`);
    }
    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
    try {
      return await this.prisma.package.update({
        where: { id },
        data: updatePackageDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Package> {
    try {
      return await this.prisma.package.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }
      throw error;
    }
  }
}