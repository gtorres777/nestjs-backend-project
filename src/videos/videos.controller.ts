// Project libraries
import { Body, Controller, Post, UseFilters, HttpException, HttpStatus } from '@nestjs/common';

// Project files
import { CreateVideoDto } from './dtos/videos.dto';
import {VideosService} from './videos.service'
import { BadRequestFilter } from 'src/helpers/bad-request.filter';

@Controller('videos')
@UseFilters(BadRequestFilter)
export class VideosController {

    constructor(
        private service: VideosService
    ) {}

    @Post()
    async addVideos(@Body() dto: CreateVideoDto) {

        const response = await this.service.createVideo(dto)

        if (response){
            return response
        } else {
            throw new HttpException(
                'No se puede agregar un mismo video que tenga el mismo url que uno existente',
                HttpStatus.BAD_REQUEST)
        }
    }

}
