import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JobApplicationStatus } from './types/types';
import { UpdateJobApplicationStatusDto } from './dto/update-status.dto';

@Injectable()
export class JobApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateJobApplicationDto) {
    // Primeiro cria a localização
    const location = await this.prisma.location.create({
      data: {
        cityId: createDto.location.cityId,
        districtId: createDto.location.districtId,
        street: createDto.location.street,
      },
    });

    // Depois cria a candidatura com o ID da localização
    return this.prisma.jobApplication.create({
      data: {
        fullName: createDto.fullName,
        identityNumber: createDto.identityNumber,
        phoneNumber: createDto.phoneNumber,
        optionalPhoneNumber: createDto.optionalPhoneNumber,
        email: createDto.email,
       
        birthDate: new Date(createDto.birthDate),
        maritalStatus: createDto.maritalStatus,
        hasChildren: createDto.hasChildren,
        knownDiseases: createDto.knownDiseases,
        desiredPosition: createDto.desiredPosition,
        availabilityDate: new Date(createDto.availabilityDate),
        professionalExperience: createDto.professionalExperience,
        highestDegree: createDto.highestDegree,
        languages: createDto.languages,
        courses: createDto.courses,
        skillsAndQualities: createDto.skillsAndQualities,
        locationId: location.id,
      },
      include: {
        location: {
          include: {
            city: true,
            district: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.jobApplication.findMany({
      include: {
        location: {
          include: {
            city: true,
            district: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id },
      include: {
        location: {
          include: {
            city: true,
            district: true,
          },
        },
      },
    });
    if (!application) {
      throw new NotFoundException('Job application not found');
    }
    return application;
  }
/*
  async update(id: string, updateDto: UpdateJobApplicationDto) {
    return this.prisma.jobApplication.update({
      where: { id },
      data: updateDto,
    });
  }
*/
  async remove(id: string) {
    return this.prisma.jobApplication.delete({
      where: { id },
    });
  }
async updateStatus(id: string, dto: UpdateJobApplicationStatusDto) {
  return this.prisma.jobApplication.update({
    where: { id },
    data: { status: dto.status },
  });
}
}
