import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { SuscriptionState } from '../interface/user-profile.interface';

export class CreateProfileUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  profile_image: string;
  
  @IsArray()
  @IsString({each: true})
  @IsOptional()
  tales_completed: string[];
  
  @IsOptional()
  @IsString()
  _user: string;

  @IsEnum(SuscriptionState)
  @IsOptional()
  suscription_state: SuscriptionState;
}
