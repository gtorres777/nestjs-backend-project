import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDto } from './dtos/videos.dto';
import {Videos} from './interface/videos.interface'

@Injectable()
export class VideosService {

    constructor(
        @InjectModel("Videos") private videoModel: Model<Videos>
    ) {

    }

    async createVideo(dto: CreateVideoDto) : Promise<Videos> {
        return await new this.videoModel(dto).save()
    }

    async getRandomVideoId(): Promise<string> {
        const allVideos = await this.videoModel.find({})
        const item = allVideos[Math.floor(Math.random() * allVideos.length)];
        return item._id
    }

}
