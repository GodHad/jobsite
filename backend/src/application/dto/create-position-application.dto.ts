import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { IsValidLinkedinProfileUrl } from '../../user/decorator/is-valid-linkedin.decorator';

export class CreatePositionApplicationDto {

  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsEmail({}, {message: "Email field does not contain a valid email address"})
  email: string;
  // resumeFileName: string;
  @IsNotEmpty()
  coverLetter: string;

  @IsValidLinkedinProfileUrl()
  @IsUrl()
  linkedinProfile: string;

  @IsOptional()
  @IsUrl()
  website: string;
}