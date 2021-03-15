import { IsString } from 'class-validator';

export class CreateVideoDto {

    @IsString()
    title: string

    @IsString()
    path: string

    @IsString()
    img: string

}