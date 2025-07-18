// src/professional/professional.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

import { Prisma } from '@prisma/client'; 
import { JobApplicationStatus } from 'src/job-application/types/types';

@Injectable()
export class ProfessionalService {
  constructor(private readonly prisma: PrismaService) {}

async create(data: CreateProfessionalDto) {
  const application = await this.prisma.jobApplication.findUnique({
    where: { id: data.applicationId },
    include: { location: true },
  });

   if (!application) {
      throw new NotFoundException('Candidatura não encontrada.');
    }

    if (application.status !== JobApplicationStatus.ACCEPTED) {
      throw new BadRequestException('A candidatura ainda não foi aprovada.');
    }

  return await this.prisma.professional.create({
    data: {
      fullName: application.fullName,
      email: application.email,
      phoneNumber: application.phoneNumber,
      availabilityType: data.availabilityType,
      experienceLevel: data.experienceLevel,
      birthDate: application.birthDate,
      maritalStatus: application.maritalStatus,
      hasChildren: application.hasChildren,
      knownDiseases: application.knownDiseases,
      desiredPosition: application.desiredPosition as any, 
      expectedSalary: data.expectedSalary,
      highestDegree: application.highestDegree,
      courses: application.courses,
      languages: application.languages,
      skillsAndQualities: application.skillsAndQualities,
      specialties: {
        connect: data.specialtyIds.map((id) => ({ id })),
      },
    location: {
        connect: {
          id: application.locationId,
        },
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


async findByFilters(filters: FilterProfessionalDto) {
  const {
    name,
    cityId,
    districtId,
    availabilityType,
    experienceLevel,
    specialtyIds,
    page = 1,
    limit = 10,
  } = filters;

  const specialtiesFilter =
    specialtyIds && specialtyIds.length > 0
      ? {
          some: {
            id: Array.isArray(specialtyIds)
              ? { in: specialtyIds }
              : specialtyIds,
          },
        }
      : undefined;

  const where: Prisma.ProfessionalWhereInput = {
    fullName: name
      ? {
          contains: name,
          mode: Prisma.QueryMode.insensitive, // ✅ CORRETO
        }
      : undefined,
    availabilityType: availabilityType || undefined,
    experienceLevel: experienceLevel || undefined,
    location: {
      cityId: cityId || undefined,
      districtId: districtId || undefined,
    },
    specialties: specialtiesFilter,
  };

  const [data, total] = await Promise.all([
    this.prisma.professional.findMany({
      where,
      include: {
        specialties: true,
        availability: true,
        location: {
          include: {
            city: true,
            district: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    this.prisma.professional.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}



    async addAvailability(data: CreateAvailabilityDto) {
    return this.prisma.availability.create({ data });
  }


}

