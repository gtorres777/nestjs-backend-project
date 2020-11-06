import { PartialType } from "@nestjs/mapped-types";
import { CreateAlternativeDto, CreateQuestionDto, CreateTalesDto } from "./tales.dto";

export class UpdateTalesDto extends PartialType(CreateTalesDto) {}
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
export class UpdateAlternativeDto extends PartialType(CreateAlternativeDto) {}