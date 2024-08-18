import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { IsValidLinkedinProfileUrl } from "../decorator/is-valid-linkedin.decorator";

export class UpdateAuthUserDto {
  @IsString()
  @MinLength(1)
  firstname: string;

  @IsString()
  @MinLength(1)
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