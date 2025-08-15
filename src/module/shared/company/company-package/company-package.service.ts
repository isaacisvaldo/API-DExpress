import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyPackage, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCompanyPackageDto } from './dto/create-company-package.dto';
import { UpdateCompanyPackageDto } from './dto/update-company-package.dto';

@Injectable()
export class CompanyPackageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyPackageDto: CreateCompanyPackageDto): Promise<CompanyPackage> {
    // Você pode adicionar validações extras aqui, como verificar se o clientCompanyProfileId e o packageId existem.
    return this.prisma.companyPackage.create({ data: createCompanyPackageDto });
  }

  async findAll(query: FindAllDto): Promise<PaginatedDto<CompanyPackage>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyPackageWhereInput = query.search
      ? {
          // Exemplo de busca: talvez você queira buscar pelo nome do pacote ou da empresa.
          // Isso requer a inclusão dos relacionamentos no findMany.
          // Por exemplo:
          // OR: [
          //   { package: { name: { contains: query.search, mode: 'insensitive' } } },
          //   { clientCompanyProfile: { companyName: { contains: query.search, mode: 'insensitive' } } },
          // ],
        }
      : {};

    const [companyPackages, total] = await this.prisma.$transaction([
      this.prisma.companyPackage.findMany({ skip, take: limit, where }),
      this.prisma.companyPackage.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: companyPackages,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<CompanyPackage> {
    const companyPackage = await this.prisma.companyPackage.findUnique({ where: { id } });
    if (!companyPackage) {
      throw new NotFoundException(`CompanyPackage with ID "${id}" not found`);
    }
    return companyPackage;
  }

  async update(id: string, updateCompanyPackageDto: UpdateCompanyPackageDto): Promise<CompanyPackage> {
    try {
      return await this.prisma.companyPackage.update({
        where: { id },
        data: updateCompanyPackageDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`CompanyPackage with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<CompanyPackage> {
    try {
      return await this.prisma.companyPackage.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`CompanyPackage with ID "${id}" not found`);
      }
      throw error;
    }
  }
}