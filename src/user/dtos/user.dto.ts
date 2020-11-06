import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { SuscriptionState } from '../interface/user.interface';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CreateProfileUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  @IsOptional()
  imagen: string;

  @IsString()
  _user: string;

  @IsEnum(SuscriptionState)
  @IsOptional()
  suscription_state: SuscriptionState;
}
