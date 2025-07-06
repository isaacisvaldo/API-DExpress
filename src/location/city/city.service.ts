import { Injectable } from '@nestjs/common';

import { CreateCityDto } from './dto/create-city.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.city.findMany();
  }

  create(data: CreateCityDto) {
    return this.prisma.city.create({ data });
  }
}