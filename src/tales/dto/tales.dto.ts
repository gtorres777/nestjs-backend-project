import { IsArray, IsNumber, IsOptional, IsString, ValidateNested, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateAlternativeDto {
  @IsString()
  label: string;
  
  @IsNumber()
  value: number
}

export class CreateQuestionDto {
  @IsString()
  pregunta: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateAlternativeDto)
  alternativa: CreateAlternativeDto[];

  @IsNumber()
  respuesta_correcta: number
}

export class CreateTalesDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  titulo: string;
  
  @IsString()
  path: string;
 
  @IsArray()
  @IsString({each: true})
  contenido: string[];

  @IsString()
  dificultad: string;

  @IsString()
  genero: string;

  @IsString()
  autor: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({each: true})
  @Type(() => CreateQuestionDto)
  preguntas: CreateQuestionDto[];
}
