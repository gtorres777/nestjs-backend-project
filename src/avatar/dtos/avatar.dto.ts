import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ListOfSet } from '../interface/avatar.interface';

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

export class BuyAvatarSetDto {
  @IsEnum(ListOfSet)
  set_name: ListOfSet

  @IsNumber()
  coins: number
}
