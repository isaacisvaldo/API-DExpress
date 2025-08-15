import { PartialType } from '@nestjs/swagger';
import { CreateDesiredPositionDto } from './create-desired-position.dto';

export class UpdateDesiredPositionDto extends PartialType(CreateDesiredPositionDto) {}
