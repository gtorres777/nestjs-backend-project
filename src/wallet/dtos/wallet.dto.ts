import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  _user: string;

  @IsOptional()
  @IsNumber()
  total_coins: number
}
