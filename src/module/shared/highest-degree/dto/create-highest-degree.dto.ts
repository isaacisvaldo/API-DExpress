import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateHighestDegreeDto {
  @ApiProperty({
    description: 'The unique name of the highest degree. Ex: "BACHELOR"',
    example: 'BACHELOR',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The label for the highest degree. Ex: "Graduação"',
    example: 'Graduação',
  })
  @IsString()
  @IsNotEmpty()
  label: string;
  
  @ApiProperty({
    description: 'The level for ordering the highest degree (1, 2, 3...).',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  level: number;
}