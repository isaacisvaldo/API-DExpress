import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(cityId: string) {
    return this.prisma.district.findMany({ where: { cityId } });
  }

  create(data: CreateDistrictDto) {
    return this.prisma.district.create({ data });
  }
}
