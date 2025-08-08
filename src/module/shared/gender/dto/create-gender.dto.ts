import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenderDto {
  @ApiProperty({
    description: 'The unique name of the gender. Ex: "MALE"',
    example: 'MALE',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The label for the gender.',
    example: 'Masculino',
  })
  @IsString()
  @IsNotEmpty()
  label: string;
}
