import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { SuscriptionState } from "../interface/user.interface";


export class CreateUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  nickname: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  imagen: string;

  @IsEnum(SuscriptionState)
  @IsOptional()
  suscription_state: SuscriptionState
}