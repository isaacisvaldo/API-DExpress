
// src/specialty/specialty.service.ts
import { Injectable } from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({ data: dto });
  }

  findAll() {
    return this.prisma.specialty.findMany();
  }


}