import { PartialType } from '@nestjs/swagger';
import { CreateGeneralAvailabilityDto } from './create-general-availability.dto';

export class UpdateGeneralAvailabilityDto extends PartialType(CreateGeneralAvailabilityDto) {}
