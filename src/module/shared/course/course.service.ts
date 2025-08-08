// src/course/course.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, Prisma } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({ data: createCourseDto });
  }


  async findAllForFrontend(): Promise<Course[]> {
    return this.prisma.course.findMany();
  }

  /**
   * Retorna uma lista paginada de cursos, com a opção de pesquisa.
   * Agora usa o DTO genérico FindAllDto.
   */
 async findAll(query: FindAllDto): Promise<PaginatedDto<Course>> {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.pageSize as string, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { label: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [courses, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({ skip, take: limit, where }),
      this.prisma.course.count({ where }),
    ]);
    
    // Cálculo do total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      data: courses,
      total,
      page,
      limit,
      totalPages,
    };
  }
  

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      return await this.prisma.course.update({ where: { id }, data: updateCourseDto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.course.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course with ID "${id}" not found`);
      }
      throw error;
    }
  }
}