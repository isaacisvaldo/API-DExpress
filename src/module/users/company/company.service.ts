// src/company-profile/company-profile.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CompanyProfileService {
  constructor(private readonly prisma: PrismaService) {}

 async create(dto: CreateCompanyProfileDto) {
    // Verifica se já existe uma empresa com mesmo e-mail, telefone ou NIF
    const existingCompany = await this.prisma.companyProfile.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phoneNumber: dto.phoneNumber },
          { nif: dto.nif },
        ],
      },
    });

    if (existingCompany) {
      throw new BadRequestException(
        'Já existe uma empresa cadastrada com este e-mail, telefone ou NIF.',
      );
    }

    // Cria a empresa se não existir duplicata
    return this.prisma.companyProfile.create({
      data: dto,
    });
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const where = search
      ? { companyName: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.companyProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { companyName: 'asc' },
      }),
      this.prisma.companyProfile.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const company = await this.prisma.companyProfile.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa não encontrada.');
    return company;
  }

  async update(id: string, dto: Partial<CreateCompanyProfileDto>) {
    return this.prisma.companyProfile.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.companyProfile.delete({ where: { id } });
  }
}
