import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { VideoSchema } from '../model/video.schema';
import { VideosService } from '../videos.service';
import { new_video3 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('VideosService', () => {

    let service: VideosService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'Videos', schema: VideoSchema }]),
            ],
            providers: [VideosService],
        }).compile();

        service = module.get<VideosService>(VideosService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('#create', () => {

        it('should not create video with null body values', async () => {

            expect.assertions(3)

            try{
                await service.createVideo(null)
            } catch (error) {
                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)
            }

        })


        it('should create video', async () => {

            const video = await service.createVideo(new_video3)
            expect(video).not.toBeNull();
            expect(video._id).not.toBeNull();
            expect(video.title).toEqual(new_video3.title)
            expect(video.path).toEqual(new_video3.path)
            expect(video.img).toEqual(new_video3.img)

        });

        it('should not add new video with an existing video_path', async () => {

            expect( await service.createVideo(new_video3) ).toBeNull()

        })

    })

    describe('# RandomVideo', () => {

        it('should retrieve randomvideo', async () => {
            //Testing the method getRandomVideoId
            const random_video = await service.getRandomVideoId()
            expect(random_video).not.toBeNull()
            expect(random_video._VideoId).not.toBeNull()
            expect(random_video._url).not.toBeNull()
            expect(random_video.video_title).not.toBeNull()
        })

    })

    describe('#Get all Videos', () => {

        it('should retrieve all the info of the available videos', async () => {

            //Testing the method getOneOutfit
            const all_videos = await service.getAllVideos()
            expect(all_videos).not.toBeNull()
            expect(all_videos).toHaveLength(1)
        })
    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
