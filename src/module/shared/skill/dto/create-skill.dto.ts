import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    description: 'The unique name of the skill.',
    example: 'JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'An optional label for the skill.',
    example: 'JS',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;
}