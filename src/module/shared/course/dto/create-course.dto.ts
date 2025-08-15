import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The unique name of the course. Ex: "Primeiros Socorros"',
    example: 'Primeiros Socorros',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'An optional label for the course.',
    example: 'Curso Básico',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;
}