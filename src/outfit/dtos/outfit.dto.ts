import { IsNumber, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ListOfSet } from 'src/avatar/interface/avatar.interface';

export class CreateOutfitDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  outfit_image: string;

  @IsEnum(ListOfSet)
  outfit_name: ListOfSet;

  @IsOptional()
  @IsString()
  type?: string;

  @IsNumber()
  price: number;
}
