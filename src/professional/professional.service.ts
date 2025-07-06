// src/professional/professional.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class ProfessionalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProfessionalDto) {
    return this.prisma.professional.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        availabilityType: data.availabilityType,
        experienceLevel: data.experienceLevel,
        locationId: data.locationId,
        specialties: {
          connect: data.specialtyIds.map((id) => ({ id })),
        },
      },
      include: {
        specialties: true,
        location: {
          include: {
            city: true,
            district: true,
          },
        },
      },
    });
  }

  findByFilters(filters: FilterProfessionalDto) {
    const { name, cityId, districtId } = filters;
    return this.prisma.professional.findMany({
      where: {
        fullName: name ? { contains: name, mode: 'insensitive' } : undefined,
        location: {
          cityId: cityId || undefined,
          districtId: districtId || undefined,
        },
      },
      include: {
        specialties: true,
        availability:true,
        location: {
          include: {
            city: true,
            district: true,
            
          },
        },
      },
    });
  }
    async addAvailability(data: CreateAvailabilityDto) {
    return this.prisma.availability.create({ data });
  }


}

