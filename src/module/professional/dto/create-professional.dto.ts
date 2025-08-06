import {
  IsString,
  IsUUID,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DesiredPosition } from '@prisma/client';
export enum GeneralAvailability {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  DAILY = 'DAILY',
  WEEKENDS = 'WEEKENDS',
  ANY = 'ANY',
}

export enum ExperienceLevel {
  LESS_THAN_1 = 'LESS_THAN_1',
  ONE_TO_THREE = 'ONE_TO_THREE',
  THREE_TO_FIVE = 'THREE_TO_FIVE',
  MORE_THAN_FIVE = 'MORE_THAN_FIVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',

}




export class CreateProfessionalDto {
  @ApiProperty({ example: 'Maria Joaquina', description: 'Nome completo do profissional' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'maria@example.com', description: 'Email do profissional' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+244912345678', description: 'Telefone do profissional' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '987654321LA044', description: 'Número de Identificação (BI ou Passaporte)', required: false })
  @IsOptional()
  @IsString()
  identityNumber?: string;

  @ApiProperty({ example: GeneralAvailability.FULL_TIME, enum: GeneralAvailability })
  @IsEnum(GeneralAvailability)
  availabilityType: GeneralAvailability;

  @ApiProperty({ example: ExperienceLevel.ONE_TO_THREE, enum: ExperienceLevel })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty({ example: 'a2f648f5-6dcd-4e3a-bdd7-26b814d6f5b6', description: 'ID da candidatura aprovada', required: false })
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @ApiProperty({ example: 'Sou responsável, pontual e tenho experiência com crianças.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-09-01', description: 'Data esperada de disponibilidade', required: false })
  @IsOptional()
  @IsDateString()
  expectedAvailability?: string;

  @ApiProperty({ example: true, description: 'Possui registro criminal?' })
  @IsBoolean()
  hasCriminalRecord: boolean;

  @ApiProperty({ example: true, description: 'Possui atestado médico?' })
  @IsBoolean()
  hasMedicalCertificate: boolean;

  @ApiProperty({ example: true, description: 'Possui certificado de formação?' })
  @IsBoolean()
  hasTrainingCertificate: boolean;

  @ApiProperty({ example: '76c1e5b4-2f33-4b90-8f83-874cbd02d9e5', description: 'ID da localização atual' })
  @IsUUID()
  locationId: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1998-05-10', description: 'Data de nascimento' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'Solteira', description: 'Estado civil' })
  @IsString()
  maritalStatus: string;

  @ApiProperty({ example: true, description: 'Possui filhos?' })
  @IsBoolean()
  hasChildren: boolean;

  @ApiProperty({ example: 'Asma', required: false })
  @IsOptional()
  @IsString()
  knownDiseases?: string;

  @ApiProperty({ enum: DesiredPosition, example: DesiredPosition.BABYSITTER })
  @IsEnum(DesiredPosition)
  desiredPosition: DesiredPosition;

  @ApiProperty({ example: 50000, description: 'Pretensão salarial em Kz' })
  @IsNumber()
  expectedSalary: number;

  @ApiProperty({ example: 'Ensino Médio Completo' })
  @IsString()
  highestDegree: string;

  @ApiProperty({ example: ['Curso de primeiros socorros', 'Cuidadora de idosos'] })
  @IsArray()
  @IsString({ each: true })
  courses: string[];

  @ApiProperty({ example: ['Português', 'Inglês'] })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ example: ['Organizada', 'Pontual', 'Boa comunicação'] })
  @IsArray()
  @IsString({ each: true })
  skillsAndQualities: string[];

  @ApiProperty({
    example: [
      '23c1b774-2f33-4b90-8f83-874cbd02d9e5',
      'd6c5f2de-35e6-4a25-996f-f0ec1584efbc',
    ],
    description: 'IDs das especialidades',
  })
  @IsArray()
  @IsString( { each: true })
  specialtyIds: string[];
 @IsOptional()
profileImage?: any;
}
