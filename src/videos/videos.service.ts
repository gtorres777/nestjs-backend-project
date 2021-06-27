// Project libraries
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Project files
import { CreateVideoDto } from './dtos/videos.dto';
import {Videos} from './interface/videos.interface'

@Injectable()
export class VideosService {

    constructor(
        @InjectModel("Videos") private videoModel: Model<Videos>
    ) {}

    async getAllVideos() : Promise<Videos[]> {
        return this.videoModel.find({})
    }

    async createVideo(dto: CreateVideoDto) : Promise<Videos> {

        if (!dto){

            throw new BadRequestException('null body values')

        } else {

            const videos = await this.getAllVideos()

            const videos_url = videos.map( video => video.path )

            if ( videos_url.includes(dto.path) ){

                return null

            } else {

                return await new this.videoModel(dto).save()
            }

        }

    }

    async getRandomVideoId(): Promise<any> {

        const allVideos = await this.videoModel.find({})
        const random_video = allVideos[Math.floor(Math.random() * allVideos.length)];
        return { _VideoId: random_video._id, _url: random_video.path, video_title: random_video.title }

    }

}
