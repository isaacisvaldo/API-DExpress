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
            id: data.locationId, // Usar data.locationId diretamente, se o Professional já o tiver
          },
        },
        profileImage: data.profileImage,
        // ✅ Alterado para conectar o Gênero pelo ID
        gender: {
          connect: {
            id: data.genderId,
          },
        },
        birthDate: new Date(data.birthDate), // Converta a string para Date, se necessário
        // ✅ Alterado para conectar o Estado Civil pelo ID
        maritalStatus: {
          connect: {
            id: data.maritalStatusId,
          },
        },
        hasChildren: data.hasChildren,
        knownDiseases: data.knownDiseases,
        // ✅ Alterado para conectar a Posição Desejada pelo ID
        desiredPosition: {
          connect: {
            id: data.desiredPositionId,
          },
        },
        expectedSalary: data.expectedSalary,
        // ✅ Alterado para conectar o Grau Acadêmico pelo ID
        highestDegree: {
          connect: {
            id: data.highestDegreeId,
          },
        },
        // ✅ Conectando as Especialidades (já estava correto, mas revisado para clareza)
        specialties: {
          connect: data.specialtyIds.map((id) => ({ id })),
        },
        // ✅ Conectando Cursos através da tabela de junção ProfessionalCourses
        professionalCourses: {
          create: data.courseIds.map((courseId) => ({
            course: {
              connect: { id: courseId },
            },
          })),
        },
        // ✅ Conectando Idiomas através da tabela de junção ProfessionalLanguages
        professionalLanguages: {
          create: data.languageIds.map((languageId) => ({
            language: {
              connect: { id: languageId },
            },
            // Você pode adicionar um 'level' aqui se o seu ProfessionalLanguages tiver esse campo
            // level: 'NIVEL_PADRAO' // Exemplo: se o nível não for enviado no DTO
          })),
        },
        // ✅ Conectando Habilidades através da tabela de junção ProfessionalSkills
        professionalSkills: {
          create: data.skillIds.map((skillId) => ({
            skill: {
              connect: { id: skillId },
            },
          })),
        },
        // Mantenha outros relacionamentos se houver (ex: Availability, Document, ProfessionalExperience)
        // availability: ...,
        // Document: ...,
        // ProfessionalExperience: ...,
      },
      // ✅ Certifique-se de incluir as novas relações se você quiser retorná-las na resposta
      include: {
        specialties: true,
        location: {
          include: {
            city: true,
            district: true,
          },
        },
        gender: true,          // Inclua o objeto Gender
        maritalStatus: true,   // Inclua o objeto MaritalStatus
        desiredPosition: true, // Inclua o objeto DesiredPosition
        highestDegree: true,   // Inclua o objeto HighestDegree
        professionalCourses: { // Inclua a tabela de junção de Cursos
          include: { course: true },
        },
        professionalLanguages: { // Inclua a tabela de junção de Idiomas
          include: { language: true },
        },
        professionalSkills: { // Inclua a tabela de junção de Habilidades
          include: { skill: true },
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
    specialtyId,
    page = 1,
    limit = 10,
  } = filters;

const specialtiesFilter = specialtyId
  ? {
      some: {
        id: specialtyId,
      },
    }
  : undefined;

  const where: Prisma.ProfessionalWhereInput = {
    fullName: name
      ? {
          contains: name,
          mode: Prisma.QueryMode.insensitive, 
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

