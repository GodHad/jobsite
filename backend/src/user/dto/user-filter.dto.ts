import { IsEnum, IsIn } from "class-validator";

export class UserFilterDto {
  @IsIn(['createdAt', 'firstname', 'lastname', 'email', 'id'])
  sortBy:string;
  @IsIn(['ASC', 'DESC'])

  sortDirection:string;
}