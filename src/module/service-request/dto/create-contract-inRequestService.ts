import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '@prisma/client';

class LocationDto {
  @IsString()
  cityId: string;

  @IsString()
  districtId: string;

  @IsString()
  street: string;
}
export class CreateContractInRequestDto {
  @IsString()
    @IsOptional()
  companyName: string;

  @IsString()
     @IsOptional()
  nif?: string;
  @IsString()
  email: string;


  @IsString()
  phone: string;

  @IsString()
    @IsOptional()
  firstName: string;
    @IsString()
    @IsOptional()
  lastName: string;

 @IsString()
    @IsOptional()
  identityNumber: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(UserType)
  clientType: UserType;

  @IsOptional()
  @IsString()
  individualClientId?: string;

  @IsOptional()
  @IsString()
  companyClientId?: string;

  @IsOptional()
  @IsString()
  professionalId?: string;

  @IsArray()
  @IsString({ each: true })
      @IsOptional()
  professionalIds: string[];

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  desiredPositionId?: string;


  @IsOptional()
  @IsString()
  sectorId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  agreedValue: number;

  @IsNumber()
  discountPercentage: number;

  @IsNumber()
  finalValue: number;

  @IsString()
  paymentTerms: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  notes: string;
}
