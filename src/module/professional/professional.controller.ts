import {
  Controller,
  Post,
  Body,
  Get,
  Query,

    UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { FilterProfessionalDto } from './dto/filter-professional.dto';
import { TranslateProfessionalPipe } from 'src/common/pipes/translate-professional.pipe';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UploadService } from 'src/upload/upload.service';
import {  FileInterceptor } from '@nestjs/platform-express';
@ApiTags('PROFISSIONAL')
@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService,private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo profissional' })
  @ApiResponse({ status: 201, description: 'Profissional cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateProfessionalDto })
@UseInterceptors(FileInterceptor('profileImage'))
  async create(@Body() body: CreateProfessionalDto, @UploadedFiles() files: { photo?: Express.Multer.File[] },) {
      let photoPath: string | null = null;

    if (files?.photo?.length) {
      const uploadResult = await this.uploadService.uploadFiles(files.photo);
      photoPath = uploadResult[0].path;
    }

    return this.professionalService.create({
      ...body,
      profileImage: photoPath, // certifique-se de que o campo existe no modelo
    });
  }

  @UseInterceptors(TranslateProfessionalPipe)
  @Get()
  @ApiOperation({ summary: 'Buscar profissionais com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de profissionais filtrados' })
  findByFilters(@Query() filters: FilterProfessionalDto) {
    return this.professionalService.findByFilters(filters);
  }

  @Post('availability')
  @ApiOperation({ summary: 'Adicionar disponibilidade ao profissional' })
  @ApiResponse({ status: 201, description: 'Disponibilidade adicionada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos para disponibilidade' })
  @ApiBody({ type: CreateAvailabilityDto })
  addAvailability(@Body() dto: CreateAvailabilityDto) {
    return this.professionalService.addAvailability(dto);
  }
}
