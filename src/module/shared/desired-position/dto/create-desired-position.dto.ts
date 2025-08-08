import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDesiredPositionDto {
  @ApiProperty({
    description: 'The unique name of the desired position.',
    example: 'Analista de Sistemas',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'An optional description of the desired position.',
    example: 'Responsibilities include analysis and design of software systems.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'An optional label for the desired position.',
    example: 'Sistemas',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;
}