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


  async create(createProfessionalDto: CreateProfessionalDto) {
    const {
      courseIds,
      languageIds,
      skillIds,
      experienceIds,
      ...professionalData
    } = createProfessionalDto;

    return this.prisma.professional.create({
      data: {
        ...professionalData,
        
        professionalCourses: courseIds && courseIds.length > 0 ? {
          createMany: {
            data: courseIds.map(courseId => ({ courseId })),
          },
        } : undefined,
        professionalLanguages: languageIds && languageIds.length > 0 ? {
          createMany: {
            data: languageIds.map(languageId => ({ languageId })),
          },
        } : undefined,
        professionalSkills: skillIds && skillIds.length > 0 ? {
          createMany: {
            data: skillIds.map(skillId => ({ skillId })),
          },
        } : undefined,
        ProfessionalExperience: experienceIds && experienceIds.length > 0 ? {
          // Para um relacionamento muitos-para-muitos direto, a sintaxe `connect` funciona
          connect: experienceIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        location: { include: { city: true, district: true } },
        desiredPosition: true,
        gender: true,
        jobApplication: true,
        experienceLevel: true,
        availability: true,
        Document: true,
        ProfessionalExperience: true,
        professionalCourses: { include: { course: true } },
        professionalLanguages: { include: { language: true } },
        professionalSkills: { include: { skill: true } },
        maritalStatus: true,
        highestDegree: true,
      },
    });
  }

  // ... (findAll method - remains unchanged as it's correct for its purpose) ...

  async findAll(filter: FilterProfessionalDto): Promise<PaginatedDto<Professional>> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProfessionalWhereInput = {
      fullName: filter.name ? { contains: filter.name, mode: 'insensitive' } : undefined,
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
      hasCriminalRecord: filter.hasCriminalRecord || undefined,
      hasMedicalCertificate: filter.hasMedicalCertificate || undefined,
      hasTrainingCertificate: filter.hasTrainingCertificate || undefined,
      hasChildren: filter.hasChildren || undefined,

      professionalCourses: filter.courseId ? { some: { courseId: filter.courseId } } : undefined,
      professionalLanguages: filter.languageId ? { some: { languageId: filter.languageId } } : undefined,
      professionalSkills: filter.skillId ? { some: { skillId: filter.skillId } } : undefined,
      ProfessionalExperience: filter.experienceId ? { some: { id: filter.experienceId } } : undefined,
    };

    const [professionals, total] = await this.prisma.$transaction([
      this.prisma.professional.findMany({
        skip,
        take: limit,
        where,
        include: {
          location: { include: { city: true, district: true } },
          desiredPosition: true,
          gender: true,
          jobApplication: true,
          experienceLevel: true,
          maritalStatus: true,
          highestDegree: true,
          availability: true,
          Document: true,
          ProfessionalExperience: true,
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
  async getPublicProfessionals(filter: FilterProfessionalDto): Promise<PaginatedDto<Professional>> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProfessionalWhereInput = {
      fullName: filter.name ? { contains: filter.name, mode: 'insensitive' } : undefined,
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
      hasCriminalRecord: filter.hasCriminalRecord || undefined,
      hasMedicalCertificate: filter.hasMedicalCertificate || undefined,
      hasTrainingCertificate: filter.hasTrainingCertificate || undefined,
      hasChildren: filter.hasChildren || undefined,

      professionalCourses: filter.courseId ? { some: { courseId: filter.courseId } } : undefined,
      professionalLanguages: filter.languageId ? { some: { languageId: filter.languageId } } : undefined,
      professionalSkills: filter.skillId ? { some: { skillId: filter.skillId } } : undefined,
      ProfessionalExperience: filter.experienceId ? { some: { id: filter.experienceId } } : undefined,
      isAvailable:true
    };

    const [professionals, total] = await this.prisma.$transaction([
      this.prisma.professional.findMany({
        
        skip,
        take: limit,
        where,
        include: {
          location: { include: { city: true, district: true } },
          desiredPosition: true,
          gender: true,
          jobApplication: true,
          experienceLevel: true,
          maritalStatus: true,
          highestDegree: true,
          availability: true,
          Document: true,
          ProfessionalExperience: true,
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

  // ... (findOne method - remains unchanged as it's correct for its purpose) ...

  async findOne(id: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
      include: {
        location: { include: { city: true, district: true } },
        desiredPosition: true,
        gender: true,
        jobApplication: true,
        experienceLevel: true,
        maritalStatus: true,
        highestDegree: true,
        availability: true,
        Document: true,
        ProfessionalExperience: true,
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
   * Para tabelas de junção explícitas, isso envolve deletar as entradas antigas
   * e criar as novas.
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
      experienceIds,
      ...professionalData
    } = updateProfessionalDto;

    try {
      // Use um $transaction para garantir que todas as operações sejam atômicas
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Atualiza os dados diretos do profissional
        const updatedProfessional = await prisma.professional.update({
          where: { id },
          data: {
            ...professionalData,
            // O relacionamento ProfessionalExperience é um many-to-many direto,
            // então 'set' funciona aqui.
            ProfessionalExperience: experienceIds && experienceIds.length > 0 ? {
              set: experienceIds.map(experienceId => ({ id: experienceId })),
            } : { set: [] },
          },
        });

        // 2. Sincroniza as tabelas de junção (ProfessionalCourses, ProfessionalLanguages, ProfessionalSkills)
        // Para cada uma, deletamos as entradas antigas e criamos as novas.

        // ProfessionalCourses
        await prisma.professionalCourses.deleteMany({
          where: { professionalId: id },
        });
        if (courseIds && courseIds.length > 0) {
          await prisma.professionalCourses.createMany({
            data: courseIds.map(courseId => ({ professionalId: id, courseId })),
          });
        }

        // ProfessionalLanguages
        await prisma.professionalLanguages.deleteMany({
          where: { professionalId: id },
        });
        if (languageIds && languageIds.length > 0) {
          await prisma.professionalLanguages.createMany({
            data: languageIds.map(languageId => ({ professionalId: id, languageId })),
          });
        }

        // ProfessionalSkills
        await prisma.professionalSkills.deleteMany({
          where: { professionalId: id },
        });
        if (skillIds && skillIds.length > 0) {
          await prisma.professionalSkills.createMany({
            data: skillIds.map(skillId => ({ professionalId: id, skillId })),
          });
        }

        // 3. Retorna o profissional atualizado com as relações incluídas
        return prisma.professional.findUnique({
          where: { id },
          include: {
            location: { include: { city: true, district: true } },
            desiredPosition: true,
            gender: true,
            jobApplication: true,
            experienceLevel: true,
            maritalStatus: true,
            highestDegree: true,
            professionalCourses: { include: { course: true } },
            professionalLanguages: { include: { language: true } },
            professionalSkills: { include: { skill: true } },
            ProfessionalExperience: true,
          },
        });
      });
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
  /**
   * Atualiza especificamente o status de disponibilidade de um profissional.
   * @param id O ID do profissional.
   * @param isAvailable O novo estado de disponibilidade (true ou false).
   * @returns O objeto Professional atualizado.
   */
  async updateAvailability(id: string, isAvailable: boolean): Promise<Professional> {
    const professional = await this.prisma.professional.findUnique({ where: { id } });
    if (!professional) {
      throw new NotFoundException(`Profissional com ID "${id}" não encontrado.`);
    }

    return this.prisma.professional.update({
      where: { id },
      data: { isAvailable }, 
    });
  }
}