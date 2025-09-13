// src/module/job-application/dto/create-job-application.dto.ts

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { CreateLocationDto } from 'src/module/shared/location/dto/create-location.dto';
import { CreateProfessionalExperienceDto } from 'src/module/professional/dto/create-professional-experience.dto';
import { IsValidEmail } from 'src/common/validators/is-valid-email';

export class CreateJobApplicationDto {
  @ApiProperty({ example: 'Isaac Bunga' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '123456789LA034' })
  @IsString()
  identityNumber: string;

  @ApiProperty({ example: '+244923456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '+244922333111', required: false })
  @IsOptional()
  @IsString()
  optionalPhoneNumber?: string;

  @ApiProperty({ example: 'isaac@email.com' })
  @IsEmail()
   @IsValidEmail() 
  email: string;

  @ApiProperty({ example: '1990-06-25' })
  @IsString() // Ajustado para corresponder ao tipo `String` do seu modelo Prisma
  birthDate: string;

  @ApiProperty({ example: 'c8369b2d-114d-44a3-8353-0941a82f347b', description: 'ID do gênero' })
  @IsUUID()
  genderId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', description: 'ID do estado civil', required: false })
  @IsOptional()
  @IsUUID()
  maritalStatusId?: string;

  @ApiProperty({ example: 'b3f5c7d9-a1b3-4f5e-88c2-7d0e1f3a2c5b', description: 'ID do nível de experiência', required: false })
  @IsOptional()
  @IsUUID()
  experienceLevelId?: string;

  @ApiProperty({ example: 'e7f8g9h0-j1k2-3l4m-5n6o-7p8q9r0s1t2u', description: 'ID da disponibilidade', required: false })
  @IsOptional()
  @IsUUID()
  generalAvailabilityId?: string;

  @ApiProperty({ example: 'b3f5c7d9-a1b3-4f5e-88c2-7d0e1f3a2c5b', description: 'ID da posição desejada' })
  @IsUUID()
  desiredPositionId: string;

  @ApiProperty({ example: 'b3f5c7d9-a1b3-4f5e-88c2-7d0e1f3a2c5b', description: 'ID do grau mais elevado' })
  @IsUUID()
  highestDegreeId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasChildren: boolean;
 @ApiProperty({ example: false, required: false })
@IsOptional()
@IsBoolean()
knownDiseases?: boolean;

  @ApiProperty({ example: '2025-07-15' })
  @IsDateString()
  availabilityDate: string;

  @ApiProperty({
    type: [CreateProfessionalExperienceDto],
    description: 'Lista de experiências profissionais',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProfessionalExperienceDto)
  ProfessionalExperience: CreateProfessionalExperienceDto[];

  @ApiProperty({
    example: ['b3f5c7d9-a1b3-4f5e-88c2-7d0e1f3a2c5b'],
    description: 'Lista de IDs de idiomas',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  languages: string[];

  @ApiProperty({
    example: ['b3f5c7d9-a1b3-4f5e-88c2-7d0e1f3a2c5b'],
    description: 'Lista de IDs de habilidades',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  skills: string[];

  @ApiProperty({
    example: ['b3f5c7d9-a1b3-4f5e-88c2-7d0e1f3a2c5b'],
    description: 'Lista de IDs de cursos',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  courses: string[];

  @ApiProperty({ type: () => CreateLocationDto })
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}