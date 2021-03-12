import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SuscriptionState } from '../interface/user-profile.interface';
import { Type } from "class-transformer";

export class CreateTalesCompletedDto {
  @IsString()
  answered_correctly: string;
  
  @IsString()
  answered_incorrectly: string;

  @IsNumber()
  times_read: number;
}

export class CreateProfileUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  profile_image: string;
  
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  favorite_tales: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateTalesCompletedDto)
  tales_completed: CreateTalesCompletedDto[];
  
  @IsOptional()
  @IsString()
  _user: string;

  @IsEnum(SuscriptionState)
  @IsOptional()
  suscription_state: SuscriptionState;
}
