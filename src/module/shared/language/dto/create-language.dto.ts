import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'The unique name of the language. Ex: "Português"',
    example: 'Português',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'An optional label for the language.',
    example: 'PT-BR',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;
}
