import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { WalletService } from 'src/wallet/wallet.service';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/models/user.schema';
import { ProfileUserSchema, VideoReferenceSchema, TalesCompletedSchema } from 'src/userProfile/models/user-profile.schema';
import { VideoSchema } from 'src/videos/model/video.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { VideosService } from 'src/videos/videos.service';
import { AuthService } from 'src/auth/services';
import { UserProfileController } from '../user-profile.controller';
import { AvatarSchema } from 'src/avatar/models/avatar.schema';
import { AvatarService } from 'src/avatar/avatar.service';
import { OutfitService } from 'src/outfit/outfit.service';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { CreateTalesCompletedDto } from '../dtos/user-profile.dto';
import { SuscriptionState } from '../interface/user-profile.interface';
import { Videos } from 'src/videos/interface/videos.interface';
import { Wallet } from 'src/wallet/interface/wallet.interface';
import { buyTimeForVideo } from '../interface/uservideos.interface';
import { TalesSchema } from 'src/tales/models/tales.schema';
import { TalesService } from 'src/tales/tales.service';
import { Tales } from 'src/tales/interface/tales.interface';
import { new_user, idUser, new_wallet, new_video, new_video2, new_tale, profileUser, new_video3, new_tale2 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('UserProfileController', () => {

    let controller: UserProfileController;
    let service: UserProfileService;

    let walletService: WalletService;

    let videoService: VideosService;

    let wallet: Wallet

    let tale: Tales

    let tale2: Tales

    let tales_completed: CreateTalesCompletedDto

    let talesService: TalesService

    let userService: UserService;


    let data_buyvideo: buyTimeForVideo

    let data_buyvideo2: buyTimeForVideo

    let video: Videos

    let req


    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'Avatar', schema: AvatarSchema },
                    { name: 'Outfit', schema: OutfitSchema },
                    { name: 'Wallet', schema: WalletSchema },
                    { name: 'User', schema: UserSchema },
                    { name: 'ProfileUser', schema: ProfileUserSchema },
                    { name: 'VideoReference', schema: VideoReferenceSchema },
                    { name: 'Videos', schema: VideoSchema },
                    { name: 'Tales', schema: TalesSchema },
                    { name: 'TalesCompleted', schema: TalesCompletedSchema },
                ]),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => {
                        return {
                            secret: configService.get<string>('JWT_SECRET_KEY'),
                            signOptions: { expiresIn: '9999999M' }
                        }
                    },
                    inject: [ConfigService]
                }),
            ],
            controllers: [UserProfileController],
            providers: [
                AvatarService,
                WalletService,
                OutfitService,
                UserService,
                UserProfileService,
                VideosService,
                AuthService,
                TalesService,
            ],
        }).compile();

        controller = module.get<UserProfileController>(UserProfileController);

        userService = module.get<UserService>(UserService);

        const user_created = await userService.addUser(new_user)

        const user_found = await userService.findOne(user_created.email)


        req = {
            user: {
                userId: user_found._id.toString(),
                username: user_found.email
            }
        }

        walletService = module.get<WalletService>(WalletService);

        wallet = await walletService.addWallet(new_wallet,idUser)

        ////////////////

        service = module.get<UserProfileService>(UserProfileService);


        // Creating video to test

        videoService = module.get<VideosService>(VideosService)

        video = await videoService.createVideo(new_video)

        await videoService.createVideo(new_video2)


        // Buy time for video data build

        data_buyvideo = {
            videoId: video._id.toString(),
            coins: 50
        }

        data_buyvideo2 = {
            videoId: video._id.toString(),
            coins: -1
        }

        // Creating tale for testing

        talesService = module.get<TalesService>(TalesService)

        tale = await talesService.addTales(new_tale)

        tale2 = await talesService.addTales(new_tale2)

    });

    it('should be defined', () => {
        expect(controller).toBeDefined();

    });

    describe('# Add Profile', () => {

        it('Should return profile created', async () => {
            const result = await (await controller.addProfile(req,profileUser)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.favorite_tales).toEqual(profileUser.favorite_tales)
            expect(result.suscription_state).toEqual(SuscriptionState.INACTIVE)
            expect(result.favorite_tales).toEqual(profileUser.favorite_tales)
            expect(result._user.toString()).toEqual(req.user.userId)
            expect(result.tales_completed).toEqual(profileUser.tales_completed)
            expect(result.user_videos).toEqual([])
        })

    })

    describe('# Get Profile', () => {

        it('Should return a profile', async () => {
            const result = await (await controller.getProfile(req)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.favorite_tales).toEqual(profileUser.favorite_tales)
            expect(result.suscription_state).toEqual(SuscriptionState.INACTIVE)
            expect(result.favorite_tales).toEqual(profileUser.favorite_tales)
            expect(result._user.toString()).toEqual(req.user.userId)
            expect(result.tales_completed).toEqual(profileUser.tales_completed)
            expect(result.user_videos).toEqual([])
        })

    })

    describe('# Get Videos User', () => {

        it('Should return videos from a given user', async () => {

            // Adding tale as completed for testing
            tales_completed = {
                tale_id: tale._id.toString(),
                answered_correctly: '2',
                answered_incorrectly: '3'
            }

            await talesService.addTaleCompleted(tales_completed, req.user.userId)

            tales_completed = {
                tale_id: tale2._id.toString(),
                answered_correctly: '2',
                answered_incorrectly: '3'
            }

            await talesService.addTaleCompleted(tales_completed, req.user.userId)

            // Testing the controller method

            const result = await controller.getVideosUser(req)

            expect(result).not.toBeNull()
            expect(result.length).toBe(2)

        })

    })

    describe('# Buy Time For Video', () => {

        it('Should not buy time for a video that a user wants because not enough coins', async () => {

            const result = await controller.buyTimeForVideo(req,data_buyvideo)

            expect(result).not.toBeNull()
            expect(result.message).toBe("No cuenta con las monedas suficientes")
            expect(result.data.toString()).toContain(await controller.getVideosUser(req))

            expect(result.wallet.total_coins).toBeGreaterThan(0)
        })

        it('Should buy time for a video that a user wants', async () => {

            const result = await controller.buyTimeForVideo(req,data_buyvideo2)

            expect(result).not.toBeNull()
            expect(result.message).toBe("Video actualizado y Monedas restadas correctamente")
            expect(result.data.toString()).toContain((await controller.getVideosUser(req))[0])
            expect(result.data[1].time_left.toString()).not.toBe((await controller.getVideosUser(req))[0].time_left)

            expect(result.wallet.total_coins).toBeGreaterThan(0)
        })
    })

    describe('# Get Stadistics', () => {

        it('Should get Stadistics for a given user', async () => {

            const result = await controller.getStadistics(req)

            expect(result).not.toBeNull()
            expect(result.message).toEqual("Datos obtenidos correctamente")
            expect(result.stadistics.today.today_tales_readed).toBe(2)
            expect(result.stadistics.today.hit_percentaje_today).toBe(40)
            expect(result.stadistics.week.week_tales_readed).toBe(2)
            expect(result.stadistics.week.hit_percentaje_week).toBe(40)
            expect(result.stadistics.total_tales).toBe(2)
        })

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
