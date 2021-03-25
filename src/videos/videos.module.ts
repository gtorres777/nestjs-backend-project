import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './model/video.schema';


@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Videos',
        schema: VideoSchema,
      }
    ]),
  ],
  exports: [VideosService, MongooseModule],
})
export class VideosModule {}
