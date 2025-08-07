
// src/specialty/specialty.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateSpecialtyDto) {
    const verify = await this.findByname(dto.name)
    if (verify) throw new BadRequestException('Já existe Esta Especialidade !');

    return this.prisma.specialty.create({ data: dto });
  }

  async findByname(name: string) {
    return this.prisma.specialty.findUnique({
      where: {
        name: name
      }
    })
  }

  findAll() {
    return this.prisma.specialty.findMany();
  }


}