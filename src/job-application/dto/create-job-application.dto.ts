import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';

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
  email: string;

  @ApiProperty({ example: 'Rua do Palácio, Bairro XYZ' })
  @IsString()
  address: string;

  @ApiProperty({ example: '1990-06-25' })
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ example: 'Casado' })
  @IsString()
  maritalStatus: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasChildren: boolean;

  @ApiProperty({ example: 'Asma', required: false })
  @IsOptional()
  @IsString()
  knownDiseases?: string;

  @ApiProperty({ example: 'Motorista' })
  @IsString()
  desiredPosition: string;

  @ApiProperty({ example: ['Português', 'Inglês'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ example: '2025-07-15' })
  @IsDateString()
  availabilityDate: Date;

  @ApiProperty({ example: '3 anos de experiência como motorista particular' })
  @IsString()
  professionalExperience: string;

  @ApiProperty({ example: 'Ensino Médio Completo' })
  @IsString()
  highestDegree: string;

  @ApiProperty({ example: ['Curso de Primeiros Socorros', 'Curso de Condução Defensiva'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  courses: string[];

  @ApiProperty({ example: ['Responsável', 'Proativo', 'Boa comunicação'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  skillsAndQualities: string[];

  @ApiProperty({ type: () => CreateLocationDto })
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}
