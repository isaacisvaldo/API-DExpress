import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMaritalStatusDto {
  @ApiProperty({
    description: 'The unique name of the marital status. Ex: "SINGLE"',
    example: 'SINGLE',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The label for the marital status. Ex: "Solteiro"',
    example: 'Solteiro',
  })
  @IsString()
  @IsNotEmpty()
  label: string;
}