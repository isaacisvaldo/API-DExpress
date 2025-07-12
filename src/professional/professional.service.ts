// src/professional/professional.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JobApplicationStatus } from '@prisma/client';

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
      desiredPosition: application.desiredPosition as any, // cast se necessário
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

findByFilters(filters: FilterProfessionalDto) {
  const {
    name,
    cityId,
    districtId,
    availabilityType,
    experienceLevel,
    specialtyIds,
  } = filters;

  // Tratamento para specialtyIds: aceita string ou string[]
  const specialtiesFilter =
    specialtyIds && specialtyIds.length > 0
      ? {
          some: {
            id: Array.isArray(specialtyIds)
              ? { in: specialtyIds }
              : specialtyIds, // string única
          },
        }
      : undefined;

  return this.prisma.professional.findMany({
    where: {
      fullName: name ? { contains: name, mode: 'insensitive' } : undefined,
      availabilityType: availabilityType || undefined,
      experienceLevel: experienceLevel || undefined,
      location: {
        cityId: cityId || undefined,
        districtId: districtId || undefined,
      },
      specialties: specialtiesFilter,
    },
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
  });
}


    async addAvailability(data: CreateAvailabilityDto) {
    return this.prisma.availability.create({ data });
  }


}

