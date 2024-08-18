import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPositionsFilterDto {
  jobTitle?: string;
  publishDate?: string;
  companySize?: string;
  jobLocation?: string;
  companyIndustry?: string;
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  page_size: number;
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  page: number;
}
