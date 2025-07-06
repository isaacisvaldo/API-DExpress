import { IsString, IsUUID, IsArray, IsEnum } from 'class-validator';
 enum GeneralAvailability {
  FULL_TIME,
  PART_TIME,
  DAILY,
  WEEKENDS,
  ANY
}

enum ExperienceLevel {
  LESS_THAN_1,
  ONE_TO_THREE,
  THREE_TO_FIVE,
  MORE_THAN_FIVE
}

export enum Weekday {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY
}

export class CreateProfessionalDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsEnum(GeneralAvailability)
  availabilityType: GeneralAvailability;

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @IsUUID()
  locationId: string;

  @IsArray()
  specialtyIds: string[];
}
