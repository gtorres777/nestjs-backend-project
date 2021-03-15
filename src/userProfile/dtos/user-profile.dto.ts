import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsEmail, IsEnum, IsOptional, IsString, ValidateNested, IsDate } from 'class-validator';
import { SuscriptionState } from '../interface/user-profile.interface';
import { Type } from "class-transformer";

export class CreateTalesCompletedDto {
  @IsString()
  tale_id: string;

  @IsString()
  answered_correctly: string;
  
  @IsString()
  answered_incorrectly: string;

  @IsOptional()
  @IsNumber()
  times_read: number;
}

export class CreateVideoReference {
  @IsString()
  _videoId: string
  
  @IsDate()
  date: Date

  @IsEnum(SuscriptionState)
  @IsString()
  state: SuscriptionState
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
