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
import { GeneralAvailability, ExperienceLevel } from '@prisma/client';



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

  // ✅ Agora é UUID do tipo relacionado (não Enum)
  @ApiProperty({ example: 'uuid-do-tipo-disponibilidade', description: 'ID do tipo de disponibilidade' })
  @IsUUID()
  availabilityTypeId: string;

  // ✅ Agora é UUID do tipo relacionado (não Enum)
  @ApiProperty({ example: 'uuid-do-nivel-experiencia', description: 'ID do nível de experiência' })
  @IsUUID()
  experienceLevelId: string;

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

  // ALTERAÇÃO: Agora é um ID (UUID)
  @ApiProperty({ example: '76c1e5b4-2f33-4b90-8f83-874cbd02d9e5', description: 'ID do gênero' })
  @IsUUID()
  genderId: string;

  @ApiProperty({ example: '1998-05-10', description: 'Data de nascimento' })
  @IsDateString()
  birthDate: string;

  // ALTERAÇÃO: Agora é um ID (UUID)
  @ApiProperty({ example: '76c1e5b4-2f33-4b90-8f83-874cbd02d9e5', description: 'ID do estado civil' })
  @IsUUID()
  maritalStatusId: string;

  @ApiProperty({ example: true, description: 'Possui filhos?' })
  @IsBoolean()
  hasChildren: boolean;

  @ApiProperty({ example: 'Asma', required: false })
  @IsOptional()
  @IsString()
  knownDiseases?: string;

  // ALTERAÇÃO: Agora é um ID (UUID)
  @ApiProperty({ example: '76c1e5b4-2f33-4b90-8f83-874cbd02d9e5', description: 'ID do cargo/posição desejada' })
  @IsUUID()
  desiredPositionId: string;

  @ApiProperty({ example: 50000, description: 'Pretensão salarial em Kz' })
  @IsNumber()
  expectedSalary: number;

  // ALTERAÇÃO: Agora é um ID (UUID)
  @ApiProperty({ example: '76c1e5b4-2f33-4b90-8f83-874cbd02d9e5', description: 'ID do grau acadêmico mais elevado' })
  @IsUUID()
  highestDegreeId: string;

  // ALTERAÇÃO: IDs para tabelas de junção
  @ApiProperty({ example: ['id-do-curso-1', 'id-do-curso-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  courseIds: string[];

  // ALTERAÇÃO: IDs para tabelas de junção
  @ApiProperty({ example: ['id-do-idioma-1', 'id-do-idioma-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  languageIds: string[];

  // ALTERAÇÃO: IDs para tabelas de junção
  @ApiProperty({ example: ['id-da-habilidade-1', 'id-da-habilidade-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds: string[];

  @ApiProperty({ example: ['23c1b774-2f33-4b90-8f83-874cbd02d9e5', 'd6c5f2de-35e6-4a25-996f-f0ec1584efbc'], description: 'IDs das especialidades' })
  @IsArray()
  @IsUUID('4', { each: true })
  specialtyIds: string[];
 
  @IsOptional()
  profileImage?: any;
}