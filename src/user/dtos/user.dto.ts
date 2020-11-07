import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


