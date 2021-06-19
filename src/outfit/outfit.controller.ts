// Project libraries
import { Body, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';

// Project files
import { CreateOutfitDto } from './dtos/outfit.dto';
import { OutfitService } from './outfit.service';

@Controller('outfit')
export class OutfitController {

    constructor(
        private service: OutfitService
    ) {}

    @Get()
    async getAll() {
        return await this.service.getAllOutfit()
    }

    @Post()
    async createOutfit(@Body() data: CreateOutfitDto) {

        const response = await this.service.addNewOutfit(data)

        if (response){
            return response
        } else {
            throw new HttpException(
                'No se puede agregar un mismo tipo de outfit que tenga el mismo nombre que uno existente',
                HttpStatus.BAD_REQUEST)
        }
    }

}
