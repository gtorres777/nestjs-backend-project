import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateSetsDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  set_name: string;

  @IsString()
  avatar_image: string;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  sets: string[];

}
