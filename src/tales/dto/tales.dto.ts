import { IsArray, IsNumber, IsOptional, IsString, ValidateNested, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { CreateTalesCompletedDto, CreateVideoReference } from "src/userProfile/dtos/user-profile.dto";

export class CreateAlternativeDto {
  @IsString()
  label: string;
  
  @IsNumber()
  value: number
}

export class UtilsDto {
  part1: CreateTalesCompletedDto
  part2: CreateVideoReference
}

export class CreateQuestionDto {
  @IsNumber()
  question_id: number;

  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateAlternativeDto)
  alternative: CreateAlternativeDto[];

  @IsNumber()
  correct_answer: number
}

export class CreateTalesDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;
  
  @IsString()
  cover_page: string;
 
  @IsArray()
  @IsString({each: true})
  content: string[];

  @IsString()
  difficulty: string;

  @IsString()
  gender: string;

  @IsString()
  author: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({each: true})
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
