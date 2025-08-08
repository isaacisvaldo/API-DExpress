import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeneralAvailabilityDto {
  @ApiProperty({ example: 'FULL_TIME', description: 'O nome único da disponibilidade.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Tempo Integral', description: 'O rótulo visível para a disponibilidade.' })
  @IsString()
  @IsNotEmpty()
  label: string;
}