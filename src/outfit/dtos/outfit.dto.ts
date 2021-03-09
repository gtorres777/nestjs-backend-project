import { IsNumber, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class OutfitDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  outfit_image: string;

  @IsString()
  outfit_name: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsNumber()
  price: number;
}
