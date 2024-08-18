import {
  MinLength,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export class SignupCredentialsDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;


  @IsNotEmpty()
  @MinLength(8)
  password:string;




}
