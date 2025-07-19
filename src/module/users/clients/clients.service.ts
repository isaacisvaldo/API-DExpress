// src/client-profile/client-profile.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ClientProfileService {
  constructor(private readonly prisma: PrismaService) {}

async create(dto: CreateClientProfileDto) {
  const existingClient = await this.prisma.clientProfile.findFirst({
    where: {
      OR: [
        { email: dto.email },
        { phoneNumber: dto.phoneNumber },
      ],
    },
  });

  if (existingClient) {
    throw new BadRequestException('Já existe um cliente com este e-mail ou telefone.');
  }

  // Cria o cliente se não existir
  return this.prisma.clientProfile.create({
    data: dto,
  });
}


  async findAll(page = 1, limit = 10, search?: string) {
    const where = search
      ? { fullName: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.clientProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.clientProfile.count({ where }),
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
    const client = await this.prisma.clientProfile.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Cliente não encontrado.');
    return client;
  }

  async update(id: string, dto: Partial<CreateClientProfileDto>) {
    return this.prisma.clientProfile.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.clientProfile.delete({ where: { id } });
  }
}
