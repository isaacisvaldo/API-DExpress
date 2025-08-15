import { PartialType } from '@nestjs/swagger';
import { CreateCompanyPackageDto } from './create-company-package.dto';

export class UpdateCompanyPackageDto extends PartialType(CreateCompanyPackageDto) {}
