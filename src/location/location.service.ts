import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateLocationDto) {
    return this.prisma.location.create({ data });
  }

  findAll() {
    return this.prisma.location.findMany({
      include: {
        city: true,
        district: true,
      },
    });
  }
}