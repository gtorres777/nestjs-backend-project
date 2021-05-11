// Project libraries
import { Body, Controller, Post } from '@nestjs/common';

// Project files
import { CreateVideoDto } from './dtos/videos.dto';
import {VideosService} from './videos.service'

@Controller('videos')
export class VideosController {

    constructor(
        private service: VideosService
    ) {}

    @Post()
    async addVideos(@Body() dto: CreateVideoDto) {
        return this.service.createVideo(dto)
    }

}
