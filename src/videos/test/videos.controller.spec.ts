import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { VideosController } from '../videos.controller';
import { VideoSchema } from '../model/video.schema';
import { VideosService } from '../videos.service';
import { new_video3 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('VideosController', () => {

    let controller: VideosController;

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
            const result = await controller.addVideos(new_video3)
            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.title).toEqual(new_video3.title)
            expect(result.img).toEqual(new_video3.img)
            expect(result.path).toEqual(new_video3.path)
        });

        it('should not create a Video with an existing path', async () => {

            try {

                await controller.addVideos(new_video3)

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
