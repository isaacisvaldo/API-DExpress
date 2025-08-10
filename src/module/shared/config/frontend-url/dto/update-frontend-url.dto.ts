import { PartialType } from '@nestjs/swagger';
import { CreateFrontendUrlDto } from './create-frontend-url.dto';

export class UpdateFrontendUrlDto extends PartialType(CreateFrontendUrlDto) {}
