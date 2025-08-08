import { IsOptional, IsString, IsNumberString, IsInt, Min } from 'class-validator';

export class FindAllCoursesQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  pageSize?: string = '10';

  @IsOptional()
  @IsString()
  search?: string;
}
