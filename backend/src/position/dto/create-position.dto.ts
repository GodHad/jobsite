import { Column } from "typeorm";
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { Type } from "class-transformer";
import * as config from "config"
const jobsConfig = config.get("job")
const companyIndustries = jobsConfig.companyIndustries;
const jobLocations = jobsConfig.location
export class CreatePositionDto {

  @IsOptional()
  id: number;
  @IsString()
  @MinLength(2)
  jobTitle: string;
  @IsString()
  @IsIn(jobLocations)
  jobLocation: string;
  @IsString()
  @MinLength(2)
  jobDescription: string;
  // @IsString()
  // @MinLength(2)
  // jobRequirements: string;
  @IsString()
  @MinLength(2)
  companyName: string;
  // @IsNumber()
  // @Type(e => Number)
  @IsString()
  companySize: number;
  @IsIn(companyIndustries)
  companyIndustry: string;
  @IsString()
  @MinLength(2)
  companyAbout: string;

  @IsOptional()
  @IsUrl()
  companyImageUrl: string;

  @IsIn(["internal", "external"])
  jobApplicationType:string;


  jobExternalUrl: string;
  // @IsString()
  // @MinLength(2)
  // @IsDateString()
  // publishDate: string;
}
