import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PositionsFilterDto {
  @IsIn([ 'jobTitle',
    'jobLocation',
    'jobDescription',
    'jobRequirements',
    'companyName',
    'companySize',
    'companyIndustry',
    'companyAbout',
    'publishDate', 'createdAt', 'id'])
  sortBy:string;
  @IsIn(['ASC', 'DESC'])

  sortDirection:string;

  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  page:number;
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  page_size:number;
}
