import { PartialType } from '@nestjs/swagger';
import { CreateHighestDegreeDto } from './create-highest-degree.dto';

export class UpdateHighestDegreeDto extends PartialType(CreateHighestDegreeDto) {}
