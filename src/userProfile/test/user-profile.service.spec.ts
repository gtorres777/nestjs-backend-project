import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { WalletService } from 'src/wallet/wallet.service';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { Wallet } from 'src/wallet/interface/wallet.interface';
import { UserProfileService } from '../user-profile.service';
import { ProfileUserSchema, VideoReferenceSchema, TalesCompletedSchema } from '../models/user-profile.schema';
import { VideosService } from 'src/videos/videos.service';
import { VideoSchema } from 'src/videos/model/video.schema';
import { CreateTalesCompletedDto } from '../dtos/user-profile.dto';
import { SuscriptionState } from '../interface/user-profile.interface';
import { Videos } from 'src/videos/interface/videos.interface';
import { new_wallet, idUser, new_video, new_video2, profileUser, idUser_to_fail, new_tale, new_video3, new_tale2 } from 'src/helpers/test-utils/fake-data/fake-data';
import { TalesService } from 'src/tales/tales.service';
import { TalesSchema } from 'src/tales/models/tales.schema';
import { Tales } from 'src/tales/interface/tales.interface';

describe('UserProfileService', () => {

    let service: UserProfileService;

    let walletService: WalletService;

    let videoService: VideosService;

    let talesService: TalesService;

    //////

    let wallet: Wallet

    let video: Videos

    let tale: Tales

    let tale2: Tales

    let tales_completed: CreateTalesCompletedDto


    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'ProfileUser', schema: ProfileUserSchema },
                    { name: 'VideoReference', schema: VideoReferenceSchema },
                    { name: 'Wallet', schema: WalletSchema },
                    { name: 'Videos', schema: VideoSchema },//// for fake tales
                    { name: 'Tales', schema: TalesSchema },
                    { name: 'TalesCompleted', schema: TalesCompletedSchema },
                ]),
            ],
            providers: [UserProfileService, VideosService, WalletService, TalesService],
        }).compile();

        service = module.get<UserProfileService>(UserProfileService);

        walletService = module.get<WalletService>(WalletService);

        wallet = await walletService.addWallet(new_wallet,idUser)

        // Creating video to test

        videoService = module.get<VideosService>(VideosService)

        video = await videoService.createVideo(new_video)

        await videoService.createVideo(new_video2)


        // Creating tales to test stadistics

        talesService = module.get<TalesService>(TalesService)

        tale = await talesService.addTales(new_tale)

        tale2 = await talesService.addTales(new_tale2)

    });

    it('should be defined', () => {
        expect(service).toBeDefined();

    });

    describe('# Add Profile', () =>{

        it('Should not add profile without ID from user', async () =>{

            try {

                await service.addProfile(profileUser,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not add profile without profileUser info', async () =>{

            try {

                await service.addProfile(null,idUser)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing profileUser info to create')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should add profileUser ', async () =>{

            const result = await (await service.addProfile(profileUser,idUser)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result._user.toString()).toEqual(idUser)
            expect(result.name).toEqual(profileUser.name)
            expect(result.profile_image).toEqual(profileUser.profile_image)
            expect(result.favorite_tales).toEqual(profileUser.favorite_tales)
            expect(result.tales_completed).toEqual(profileUser.tales_completed)
            expect(result.suscription_state).toEqual(profileUser.suscription_state)
            expect(result.user_videos).not.toBeNull()

        })

    })

    describe('# Get Profile', () =>{

        it('Should not retrieve Profile info without ID from user', async () =>{

            try {

                await service.getProfile(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not retrieve Profile info if not found', async () =>{

            try {

                await service.getProfile(idUser_to_fail)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No userprofile found for the given user')
                expect(error.response.statusCode).toEqual(404)

            }

        })

        it('Should retrieve Profile', async () =>{

            const result = await (await service.getProfile(idUser)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result._user.toString()).toBe(idUser)
            expect(result.name).toEqual(profileUser.name)
            expect(result.profile_image).toEqual(profileUser.profile_image)
            expect(result.favorite_tales).toEqual(profileUser.favorite_tales)
            expect(result.tales_completed).toEqual(profileUser.tales_completed)

        })

    })

    describe('# Get Random Video', () =>{

        it('Should not get random video without user_videos list', async () =>{

            try {

                await service.getRandomVideo(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing User videos list')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should get random video for users with a user_videos list length less than 0', async () =>{

            const user = await service.getProfile(idUser)

            const result = await service.getRandomVideo(user.user_videos)

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.state).toEqual(SuscriptionState.ACTIVE)
            expect(result.time_left).toEqual("24 horas")

            // Adding tale as completed for testing videos
            tales_completed = {
                tale_id: tale._id.toString(),
                answered_correctly: '2',
                answered_incorrectly: '3'
            }

            await talesService.addTaleCompleted(tales_completed, idUser.toString())

        })

        it('Should get random different video for users with a user_videos list length greater than 0', async () =>{

            const user = await service.getProfile(idUser)

            const result = await service.getRandomVideo(user.user_videos)

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.state).toEqual(SuscriptionState.ACTIVE)
            expect(result.time_left).toEqual("24 horas")
            expect(result._videoId).not.toEqual(user.user_videos[0]._videoId)

            tales_completed = {
                tale_id: tale2._id.toString(),
                answered_correctly: '1',
                answered_incorrectly: '4'
            }

            await talesService.addTaleCompleted(tales_completed, idUser.toString())
        })

    })

    describe('# Get All Videos', () =>{

        it('Should not get all videos without ID from user', async () =>{

            try {

                await service.getAllVideos(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not get all videos if profile not found', async () =>{

            try {

                await service.getAllVideos(idUser_to_fail)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No profile found for the given user')
                expect(error.response.statusCode).toEqual(404)

            }

        })

        it('Should get all videos', async () =>{

            // for next upgrade we should validate the format and the way it validates the time is retrieved in this function
            const result = await service.getAllVideos(idUser)

            expect(result).not.toBeNull()
            expect(result.length).toBe(2)
            expect(result[0].time_left).toBe('24 horas')

        })

    })

    describe('# Buy Time For Video', () =>{

        it('Should not buy time for a video without ID from user', async () =>{

            try {

                await service.buyTimeForVideo(video._id,null,1)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not buy time for a video without ID from video', async () =>{

            try {

                await service.buyTimeForVideo(null,idUser,1)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from video')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not buy time for a video without ID from user', async () =>{

            try {

                await service.buyTimeForVideo(video._id,idUser,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing number of coins')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not buy time for a video if no video found for the given videoID', async () =>{

            try {

                /// passing just a videoId that will fail
                await service.buyTimeForVideo(idUser_to_fail,idUser,5)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No video found for the given videoId')
                expect(error.response.statusCode).toEqual(404)

            }

        })

        it('Should not buy time for video if doesnt have enough coins', async () =>{

            const result = await service.buyTimeForVideo(video._id,idUser,500)

            expect(result).not.toBeNull()
            expect(result.status).toBe(301)
            expect(result.message).toBe('No cuenta con las monedas suficientes')
            expect(result.data.toString()).toContain(await service.getAllVideos(idUser))

        })

        it('Should buy time for video ', async () =>{

            const result = await service.buyTimeForVideo(video._id.toString(),idUser,5)

            expect(result).not.toBeNull()
            expect(result.status).toBe(201)
            expect(result.message).toBe('Video actualizado y Monedas restadas correctamente')
            expect(result.data.toString()).toContain(await service.getAllVideos(idUser))

        })

    })

    describe('# Get Stadistics', () =>{

        it('Should not get stadistics without ID from user', async () =>{

            try {

                await service.getStadistics(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should get Stadistics', async () =>{


            // for next upgrade we should validate the format and the way it validates the time is retrieved in this function
            const result = await service.getStadistics(idUser)

            expect(result).not.toBeNull()
            expect(result.status).toBe(201)
            expect(result.message).toEqual("Datos obtenidos correctamente")
            expect(result.stadistics.today.today_tales_readed).toBe(2)
            expect(result.stadistics.today.hit_percentaje_today).toBe(30)
            expect(result.stadistics.week.week_tales_readed).toBe(2)
            expect(result.stadistics.week.hit_percentaje_week).toBe(30)
            expect(result.stadistics.total_tales).toBe(2)

        })

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
