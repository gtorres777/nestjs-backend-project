// Project libraries
import { Body } from '@nestjs/common';
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
    getAll() {
        return this.service.getAllOutfit()
    }

    @Post()
    createOutfit(@Body() data: CreateOutfitDto) {
        return this.service.addNewOutfit(data)
    }

}
