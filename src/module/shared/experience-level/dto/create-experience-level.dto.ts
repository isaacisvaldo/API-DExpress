import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExperienceLevelDto {
  @ApiProperty({ example: 'JUNIOR', description: 'O nome único do nível de experiência.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Júnior', description: 'O rótulo visível para o nível de experiência.' })
  @IsString()
  @IsNotEmpty()
  label: string;
}