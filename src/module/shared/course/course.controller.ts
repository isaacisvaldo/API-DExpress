import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { Course } from '@prisma/client';
import { FindAllDto } from 'src/common/pagination/find-all.dto';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';

@ApiTags('Courses')
@Controller('courses') 
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo curso' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso.' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os cursos com paginação e pesquisa' })
  @ApiOkResponse({ type: PaginatedDto, description: 'Lista de cursos paginada.' })
  findAll(@Query() query: FindAllDto): Promise<PaginatedDto<Course>> {
    return this.courseService.findAll(query);
  }
  
  @Get('list')
  @ApiOperation({ summary: 'Lista todos os cursos para uso em formulários' })
  @ApiOkResponse({  description: 'Lista completa de todos os cursos.' })
  findAllForFrontend(): Promise<Course[]> {
    return this.courseService.findAllForFrontend();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um curso pelo ID' })
  @ApiOkResponse({ description: 'Curso encontrado.' })
  findOne(@Param('id') id: string) {
    // O id do Prisma é um string (UUID)
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um curso' })
  @ApiOkResponse({ description: 'Curso atualizado com sucesso.' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um curso' })
  @ApiOkResponse({ description: 'Curso removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
