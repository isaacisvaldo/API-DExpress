// src/frontend-url/dto/create-frontend-url.dto.ts

import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateFrontendUrlDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'A URL deve ser uma URL válida.' })
  url: string;
}