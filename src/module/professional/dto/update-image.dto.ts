// professional/dto/update-image.dto.ts
import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'A nova URL para a imagem de perfil do profissional',
    example: 'https://example.com/new-image.jpg',
  })
  imageUrl: string;
}