// src/professional/professional.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';

import { Professional, Prisma } from '@prisma/client';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class ProfessionalService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo profissional, incluindo as conexões com as tabelas de junção.
   * @param createProfessionalDto O DTO com os dados do profissional e os IDs de suas relações.
   * @returns O profissional recém-criado.
   */
  async create(createProfessionalDto: CreateProfessionalDto) {
    const {
      courseIds,
      languageIds,
      skillIds,
      specialtyIds,
      ...professionalData
    } = createProfessionalDto;

    return this.prisma.professional.create({
      data: {
        ...professionalData,
        // Conecta as relações many-to-many
        professionalCourses: {
          createMany: {
            data: courseIds.map(courseId => ({ courseId })),
          },
        },
        professionalLanguages: {
          createMany: {
            data: languageIds.map(languageId => ({ languageId })),
          },
        },
        professionalSkills: {
          createMany: {
            data: skillIds.map(skillId => ({ skillId })),
          },
        },
        specialties: {
          connect: specialtyIds.map(id => ({ id })),
        },
      },
      include: {
        professionalCourses: { include: { course: true } },
        professionalLanguages: { include: { language: true } },
        professionalSkills: { include: { skill: true } },
        specialties: true,
      },
    });
  }

  /**
   * Retorna uma lista paginada de profissionais, com a opção de pesquisa avançada.
   * @param filter O DTO com os parâmetros de filtro e paginação.
   * @returns Um objeto com a lista de profissionais, a contagem total, a página atual e o limite.
   */
  async findAll(filter: FilterProfessionalDto): Promise<PaginatedDto<Professional>> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProfessionalWhereInput = {
      // Filtros de texto
      fullName: filter.name ? { contains: filter.name, mode: 'insensitive' } : undefined,

      // Filtros de IDs diretos
      location: {
        cityId: filter.cityId || undefined,
        districtId: filter.districtId || undefined,
      },
      availabilityTypeId: filter.availabilityTypeId || undefined,
      experienceLevelId: filter.experienceLevelId || undefined,
      desiredPositionId: filter.desiredPositionId || undefined,
      genderId: filter.genderId || undefined,
      maritalStatusId: filter.maritalStatusId || undefined,
      highestDegreeId: filter.highestDegreeId || undefined,

      // Filtros de booleanos
      hasCriminalRecord: filter.hasCriminalRecord || undefined,
      hasMedicalCertificate: filter.hasMedicalCertificate || undefined,
      hasTrainingCertificate: filter.hasTrainingCertificate || undefined,
      hasChildren: filter.hasChildren || undefined,

      // Filtros para relações muitos-para-muitos (aqui garantimos que o profissional tenha TODOS os itens)
      professionalCourses: filter.courseIds
        ? {
            every: {
              courseId: { in: filter.courseIds },
            },
          }
        : undefined,
      professionalLanguages: filter.languageIds
        ? {
            every: {
              languageId: { in: filter.languageIds },
            },
          }
        : undefined,
      professionalSkills: filter.skillIds
        ? {
            every: {
              skillId: { in: filter.skillIds },
            },
          }
        : undefined,
      specialties: filter.specialtyId
        ? {
            some: { id: filter.specialtyId },
          }
        : undefined,
    };

    const [professionals, total] = await this.prisma.$transaction([
      this.prisma.professional.findMany({
        skip,
        take: limit,
        where,
        include: {
          location: { include: { city: true, district: true } },
          availabilityType: true,
          experienceLevel: true,
          gender: true,
          maritalStatus: true,
          desiredPosition: true,
          highestDegree: true,
          specialties: true,
          professionalCourses: { include: { course: true } },
          professionalLanguages: { include: { language: true } },
          professionalSkills: { include: { skill: true } },
        },
      }),
      this.prisma.professional.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: professionals,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Encontra um profissional específico pelo seu ID, incluindo todas as suas relações.
   * @param id O ID do profissional (UUID em string).
   * @returns O profissional encontrado.
   * @throws NotFoundException se o profissional não for encontrado.
   */
  async findOne(id: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
      include: {
        location: { include: { city: true, district: true } },
        availabilityType: true,
        experienceLevel: true,
        gender: true,
        maritalStatus: true,
        desiredPosition: true,
        highestDegree: true,
        specialties: true,
        professionalCourses: { include: { course: true } },
        professionalLanguages: { include: { language: true } },
        professionalSkills: { include: { skill: true } },
      },
    });
    if (!professional) {
      throw new NotFoundException(`Professional with ID "${id}" not found`);
    }
    return professional;
  }

  /**
   * Atualiza um profissional existente. As relações many-to-many são sincronizadas.
   * @param id O ID do profissional a ser atualizado (UUID em string).
   * @param updateProfessionalDto O DTO com os dados a serem atualizados.
   * @returns O profissional atualizado.
   * @throws NotFoundException se o profissional não for encontrado.
   */
  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    const {
      courseIds,
      languageIds,
      skillIds,
      specialtyIds,
      ...professionalData
    } = updateProfessionalDto;

    try {
     return "Em Desenvolvimento !"
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Professional with ID "${id}" not found`);
      }
      throw error;
    }
  }

  /**
   * Remove um profissional do banco de dados.
   * @param id O ID do profissional a ser removido (UUID em string).
   * @returns O profissional que foi removido.
   * @throws NotFoundException se o profissional não for encontrado.
   */
  async remove(id: string) {
    try {
      return await this.prisma.professional.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Professional with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
