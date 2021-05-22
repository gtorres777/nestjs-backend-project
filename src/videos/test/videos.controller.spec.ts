import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { VideosController } from '../videos.controller';
import { VideoSchema } from '../model/video.schema';
import { VideosService } from '../videos.service';
import { CreateVideoDto } from '../dtos/videos.dto';

describe('VideosController', () => {

    let controller: VideosController;

    const new_video: CreateVideoDto = {
        title:"video3",
        path:"http://urlvideo3",
        img:"coverpage3"
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'Videos', schema: VideoSchema }]),
            ],
            controllers: [VideosController],
            providers: [VideosService],
        }).compile();

        controller = module.get<VideosController>(VideosController);
    });

    describe('addVideos', () => {

        it('should create a Video', async () => {
            const result = await controller.addVideos(new_video)
            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.title).toEqual(new_video.title)
            expect(result.img).toEqual(new_video.img)
            expect(result.path).toEqual(new_video.path)
        });

        it('should not create a Video with an existing path', async () => {

            try {

                await controller.addVideos(new_video)

            } catch (error) {

                expect(error).not.toBeNull()
                expect(error.response).toEqual('No se puede agregar un mismo video que tenga el mismo url que uno existente')
                expect(error.status).toEqual(400)

            }
        });

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
