// src/professional/professional.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

import { JobApplicationStatus, Prisma } from '@prisma/client'; 


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
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      identityNumber: data.identityNumber,
      isAvailable: false,
      availabilityType: data.availabilityType,
      experienceLevel: data.experienceLevel,
      jobApplication: {
        connect: {
          id: data.applicationId,
        },
      },
      description: data.description,
      expectedAvailability: data.expectedAvailability,
      hasCriminalRecord: data.hasCriminalRecord,
      hasMedicalCertificate: data.hasMedicalCertificate,
      hasTrainingCertificate: data.hasTrainingCertificate,
      location: {
        connect: {
          id: application.locationId,
        },
      },
      profileImage: data.profileImage,
      gender: data.gender,
      birthDate: data.birthDate,
      maritalStatus: data.maritalStatus,
      hasChildren: data.hasChildren,
      knownDiseases: data.knownDiseases,
      desiredPosition: data.desiredPosition,
      expectedSalary: data.expectedSalary,
      highestDegree: data.highestDegree,
      courses: data.courses,
      languages: data.languages,
      skillsAndQualities: data.skillsAndQualities,
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

