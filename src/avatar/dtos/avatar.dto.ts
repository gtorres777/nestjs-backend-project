import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  _user: string;

  @IsOptional()
  @IsString()
  avatar_name: string;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  avatar_sets: string[];
  
  @IsOptional()
  @IsString()
  current_style: string;
}
