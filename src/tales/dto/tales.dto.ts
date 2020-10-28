import { IsOptional, IsString } from "class-validator";

export class CreateTalesDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  titulo: string;
 
  @IsString()
  contenido: string;

  @IsString()
  dificultad: string;

  @IsString()
  genero: string;

  @IsString()
  autor: string;

  @IsString()
  preguntas: string;
}
