import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateJobApplicationStatusDto } from './dto/update-status.dto';
import { FilterJobApplicationDto } from './dto/filter-job-application.dto';
import { testDomains } from 'src/common/test-domain';
import * as dns from 'dns';

@Injectable()
export class JobApplicationService {
  constructor(private readonly prisma: PrismaService) {}

 async create(createDto: CreateJobApplicationDto) {

      const domain = createDto.email.split('@')[1];
      
        // 1. Verificação se o e-mail é de teste (nova verificação)
        if (testDomains.includes(domain)) {
          throw new BadRequestException('E-mails de teste não são permitidos.');
        }
        // 1. Validação do formato do e-mail
        const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createDto.email);
        if (!isValidFormat) {
          throw new BadRequestException('Formato de e-mail inválido.');
        }
        // 2. Verificação do domínio (registros MX)
      
        try {
          const mxRecords = await new Promise<dns.MxRecord[]>((resolve, reject) => {
            dns.resolveMx(domain, (err, addresses) => {
              if (err) {
                // Se houver erro, rejeita a Promise
                return reject(err);
              }
              // Se der certo, resolve a Promise com o array de registros
              resolve(addresses);
            });
          });
      
          // Agora mxRecords é garantido ser um array,
          // então a verificação do length funciona
          if (mxRecords.length === 0) {
            throw new BadRequestException('O domínio do e-mail não é válido.');
          }
        } catch (error) {
         
          throw new BadRequestException('O domínio do e-mail não é válido.');
        }
        

      
    // 2. Verificação da existência de TODOS os IDs relacionados
    // (Relacionamentos muitos-para-um)
    const [
      gender,
      desiredPosition,
      highestDegree,
      maritalStatus,
      experienceLevel,
      generalAvailability,
    ] = await this.prisma.$transaction([
      this.prisma.gender.findUnique({ where: { id: createDto.genderId } }),
      this.prisma.desiredPosition.findUnique({ where: { id: createDto.desiredPositionId } }),
      this.prisma.highestDegree.findUnique({ where: { id: createDto.highestDegreeId } }),
      this.prisma.maritalStatus.findUnique({ where: { id: createDto.maritalStatusId } }),
      this.prisma.experienceLevel.findUnique({ where: { id: createDto.experienceLevelId } }),
      this.prisma.generalAvailability.findUnique({ where: { id: createDto.generalAvailabilityId } }),
    ]);

    if (!gender) throw new NotFoundException(`Gender with ID "${createDto.genderId}" not found.`);
    if (!desiredPosition) throw new NotFoundException(`Desired Position with ID "${createDto.desiredPositionId}" not found.`);
    if (!highestDegree) throw new NotFoundException(`Highest Degree with ID "${createDto.highestDegreeId}" not found.`);
    if (!maritalStatus) throw new NotFoundException(`Marital Status with ID "${createDto.maritalStatusId}" not found.`);
    if (!experienceLevel) throw new NotFoundException(`Experience Level with ID "${createDto.experienceLevelId}" not found.`);
    if (!generalAvailability) throw new NotFoundException(`General Availability with ID "${createDto.generalAvailabilityId}" not found.`);

    // (Relacionamentos muitos-para-muitos - arrays de IDs)
    const [courses, languages, skills] = await this.prisma.$transaction([
      this.prisma.course.findMany({ where: { id: { in: createDto.courses } } }),
      this.prisma.language.findMany({ where: { id: { in: createDto.languages } } }),
      this.prisma.skill.findMany({ where: { id: { in: createDto.skills } } }),
    ]);

    if (courses.length !== createDto.courses.length) {
      throw new NotFoundException('One or more Course IDs are invalid.');
    }
    if (languages.length !== createDto.languages.length) {
      throw new NotFoundException('One or more Language IDs are invalid.');
    }
    if (skills.length !== createDto.skills.length) {
      throw new NotFoundException('One or more Skill IDs are invalid.');
    }

    // 2. Verificação da Localização
    const city = await this.prisma.city.findUnique({
      where: { id: createDto.location.cityId },
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }

    const district = await this.prisma.district.findUnique({
      where: { id: createDto.location.districtId },
    });
    if (!district) {
      throw new NotFoundException('District not found');
    }
    
    // 3. Criação da Localização
    const location = await this.prisma.location.create({
      data: {
        cityId: createDto.location.cityId,
        districtId: createDto.location.districtId,
        street: createDto.location.street,
      },
    });

    // 4. Criação da Candidatura e Conexão de Relacionamentos
    return this.prisma.jobApplication.create({
      data: {
        fullName: createDto.fullName,
        identityNumber: createDto.identityNumber,
        phoneNumber: createDto.phoneNumber,
        optionalPhoneNumber: createDto.optionalPhoneNumber,
        email: createDto.email,
        birthDate: createDto.birthDate,
        hasChildren: createDto.hasChildren,
        knownDiseases: createDto.knownDiseases,
        availabilityDate: createDto.availabilityDate,
        locationId: location.id,

        // Conecta os relacionamentos muitos-para-um (IDs)
        genderId: createDto.genderId,
        desiredPositionId: createDto.desiredPositionId,
        highestDegreeId: createDto.highestDegreeId,
        maritalStatusId: createDto.maritalStatusId,
        experienceLevelId: createDto.experienceLevelId,
        generalAvailabilityId: createDto.generalAvailabilityId,

        // Conecta os relacionamentos muitos-para-muitos (arrays de IDs)
        languages: {
          connect: createDto.languages.map(id => ({ id })),
        },
        skills: {
          connect: createDto.skills.map(id => ({ id })),
        },
        courses: {
          connect: createDto.courses.map(id => ({ id })),
        },

        // Cria as experiências profissionais aninhadas
        ProfessionalExperience: {
          create: createDto.ProfessionalExperience,
        },
      },
      include: {
        location: {
          include: {
            city: true,
            district: true,
          },
        },
        gender: true,
        desiredPosition: true,
        highestDegree: true,
        maritalStatus: true,
        experienceLevel: true,
        generalAvailability: true,
        languages: true,
        skills: true,
        courses: true,
        ProfessionalExperience: true,
      },
    });
  }


  // Mantenha os outros métodos `findAll`, `findOne`, `remove`, etc. aqui.
  async findAll(filters: FilterJobApplicationDto) {
    const {
      fullName,
      status,
      cityId,
      districtId,
      desiredPositionId,
      genderId,
      highestDegreeId,
      createdAtStart, // Novo
      createdAtEnd,   // Novo
      page = 1,
      limit = 10,
    } = filters;

    // Constrói a cláusula `where` de forma dinâmica
    const where: any = {
      // Filtro por nome
      ...(fullName && { fullName: { contains: fullName, mode: 'insensitive' } }),

      // Filtro por status
      ...(status && { status: status }),

      // Filtro por localização
      ...(cityId && { location: { cityId: cityId } }),
      ...(districtId && { location: { districtId: districtId } }),
      
      // Filtros por IDs de relacionamento
      ...(desiredPositionId && { desiredPositionId: desiredPositionId }),
      ...(genderId && { genderId: genderId }),
      ...(highestDegreeId && { highestDegreeId: highestDegreeId }),

      // Filtros por intervalo de data de criação
      ...(createdAtStart && { createdAt: { gte: new Date(createdAtStart) } }),
      ...(createdAtEnd && { createdAt: { lte: new Date(createdAtEnd) } }),
    };
    
    // Adiciona o filtro de intervalo de datas de forma mais concisa
    if (createdAtStart || createdAtEnd) {
      where.createdAt = {};
      if (createdAtStart) {
        where.createdAt.gte = new Date(createdAtStart); // gte = greater than or equal
      }
      if (createdAtEnd) {
        where.createdAt.lte = new Date(createdAtEnd); // lte = less than or equal
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        include: {
          location: {
            include: {
              city: true,
              district: true,
            },
          },
          gender: true,
          desiredPosition: true,
          highestDegree: true,
          maritalStatus: true,
          experienceLevel: true,
          generalAvailability: true,
          languages: true,
          skills: true,
          courses: true,
          ProfessionalExperience: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.jobApplication.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
        gender: true,
        desiredPosition: true,
        highestDegree: true,
        maritalStatus: true,
        experienceLevel: true,
        generalAvailability: true,
        languages: true,
        skills: true,
        courses: true,
        ProfessionalExperience: true,
      },
    });
    if (!application) {
      throw new NotFoundException('Job application not found');
    }
    return application;
  }

  async remove(id: string) {
    return this.prisma.jobApplication.delete({
      where: { id },
    });
  }
async updateStatus(id: string, dto: UpdateJobApplicationStatusDto) {
  return this.prisma.jobApplication.update({
    where: { id },
    data: { status: dto.status },
    include:{
        location: {
          include: {
            city: true,
            district: true,
          },
        },
        gender: true,
        desiredPosition: true,
        highestDegree: true,
        maritalStatus: true,
        experienceLevel: true,
        generalAvailability: true,
        languages: true,
        skills: true,
        courses: true,
        ProfessionalExperience: true,
    }
  });
}

async findProfessionalProfile(jobApplicationId: string){
  const professional = await this.prisma.professional.findUnique({
    where: { jobApplicationId: jobApplicationId }
  });


  return professional;
}
}