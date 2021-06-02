import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { TalesService } from '../tales.service';
import { TalesSchema } from '../models/tales.schema';
import { TalesCompletedSchema, ProfileUserSchema, VideoReferenceSchema } from 'src/userProfile/models/user-profile.schema';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { WalletService } from 'src/wallet/wallet.service';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { VideosService } from 'src/videos/videos.service';
import { VideoSchema } from 'src/videos/model/video.schema';
import { new_tale, new_tale2, new_tale_for_update, idUser, new_user, new_video } from 'src/helpers/test-utils/fake-data/fake-data';
import { Tales } from '../interface/tales.interface';
import { UserSchema } from 'src/user/models/user.schema';
import { UserService } from 'src/user/user.service';
import { AvatarService } from 'src/avatar/avatar.service';
import { AvatarSchema } from 'src/avatar/models/avatar.schema';
import { AuthService } from 'src/auth/services';
import { OutfitService } from 'src/outfit/outfit.service';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateTalesCompletedDto } from 'src/userProfile/dtos/user-profile.dto';
import { TalesController } from '../tales.controller';

describe('TalesController', () => {

    let controller: TalesController;

    let tale: Tales

    let tales_completed: CreateTalesCompletedDto

    let walletService: WalletService

    ///// FOR FAKE USER

    let userService: UserService;

    let userProfileService: UserProfileService;

    let req

    ////

    ///// FOR FAKE VIDEOS

    let videosService: VideosService

    //

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'Tales', schema: TalesSchema },
                    { name: 'TalesCompleted', schema: TalesCompletedSchema},
                    { name: 'ProfileUser', schema: ProfileUserSchema},
                    { name: 'VideoReference', schema: VideoReferenceSchema},
                    { name: 'Wallet', schema: WalletSchema},
                    { name: 'Videos', schema: VideoSchema},//after are for userid
                    { name: 'User', schema: UserSchema},
                    { name: 'Avatar', schema: AvatarSchema},
                    { name: 'Outfit', schema: OutfitSchema},
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
            controllers: [TalesController],
            providers: [
                TalesService,
                UserProfileService,
                WalletService,
                VideosService,
                UserService,
                AvatarService,
                AuthService,
                OutfitService,
            ],
        }).compile();

        controller = module.get<TalesController>(TalesController);

        ////

        userService = module.get<UserService>(UserService);

        userProfileService = module.get<UserProfileService>(UserProfileService);

        const user_created = await userService.addUser(new_user)

        const user_found = await userService.findOne(user_created.email)

        req = {
            user: {
                userId: user_found._id,
                username: user_found.email
            }
        }
        ////

        /// ADDING VIDEOS TO TEST

        videosService = module.get<VideosService>(VideosService)

        await videosService.createVideo(new_video)

        //

        walletService = module.get<WalletService>(WalletService)

    });

    it('should be defined', () => {
        expect(controller).toBeDefined();

    });

    describe('# Add Tale', () =>{

        it('Should add Tale ', async () =>{

            tale  = await (await controller.addTales(new_tale)).toObject()

            expect(tale).not.toBeNull()
            expect(tale._id).not.toBeNull()
            expect(tale.content.toString()).toContain(new_tale.content)
            expect(tale.title).toBe(new_tale.title)
            expect(tale.cover_page).toBe(new_tale.cover_page)
            expect(tale.difficulty).toBe(new_tale.difficulty)
            expect(tale.gender).toBe(new_tale.gender)
            expect(tale.author).toBe(new_tale.author)
            expect(tale.questions.toString()).toContain(new_tale.questions)

            /// Added another tale for testing
            await controller.addTales(new_tale2)
        })

    })

    describe('# Update Tale', () =>{

        it('Should update a Tale ', async () =>{

            const result = await (await controller.updateTales(tale._id, new_tale_for_update)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.content.toString()).toContain(new_tale_for_update.content)
            expect(result.title).toBe(new_tale_for_update.title)
            expect(result.cover_page).toBe(new_tale_for_update.cover_page)
            expect(result.difficulty).toBe(new_tale_for_update.difficulty)
            expect(result.gender).toBe(new_tale_for_update.gender)
            expect(result.author).toBe(new_tale_for_update.author)
            expect(result.questions.toString()).toContain(new_tale_for_update.questions)

        })

    })

    describe('# Get One Tale', () =>{

        it('Should get info of a Tale ', async () =>{

            const result = await (await controller.getOneTale(tale._id)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.content.toString()).toContain(new_tale_for_update.content)
            expect(result.title).toBe(new_tale_for_update.title)

        })

    })

    describe('# Add Favorite Tale', () =>{


        it('Should add a tale to favorites', async () =>{

            const result = await controller.addFavoriteTale(tale._id.toString(),req)

            expect(result).not.toBeNull()
            expect(result.status).toBe(202)
            expect(result.message).toBe('Cuento favorito agregado correctamente')

        })

        it('Should not add a tale to favorites if already exists', async () =>{

            const result = await controller.addFavoriteTale(tale._id.toString(),req)

            expect(result).not.toBeNull()
            expect(result.status).toBe(202)
            expect(result.message).toBe('Ya tiene agregado este cuento a sus favoritos')

        })
    })

    describe('# Get Favorite Tales', () =>{

        it('Should retrieve info of a tale from favorites', async () =>{

            const result:any = await controller.getFavoriteTales(req)

            expect(result).not.toBeNull()
            expect(result[0]._id).not.toBeNull()
            expect(result[0].content.toString()).toContain(new_tale_for_update.content)
            expect(result[0].title).toBe(new_tale_for_update.title)
            expect(result[0].cover_page).toBe(new_tale_for_update.cover_page)
            expect(result[0].difficulty).toBe(new_tale_for_update.difficulty)
            expect(result[0].gender).toBe(new_tale_for_update.gender)
            expect(result[0].author).toBe(new_tale_for_update.author)

        })

    })

    describe('# Remove Favorite Tale', () =>{

        it('Should remove a tale from favorites', async () =>{

            const result = await controller.removeFavoriteTale(tale._id.toString(),req)

            expect(result).not.toBeNull()
            expect(result.status).toBe(204)
            expect(result.message).toBe('Cuento favorito removido correctamente')

        })

        it('Should not remove a tale from favorites if not found', async () =>{

            const result = await controller.removeFavoriteTale(tale._id.toString(),req)

            expect(result).not.toBeNull()
            expect(result.status).toBe(205)
            expect(result.message).toBe('Id de cuento no encontrado')

        })
    })

    describe('# Add Tale Completed', () =>{

        it('Should add a tale as completed', async () =>{

            tales_completed = {
                tale_id: tale._id.toString(),
                answered_correctly: '2',
                answered_incorrectly: '3'
            }

            const result = await controller.addTaleCompleted(tales_completed,req)

            expect(result).not.toBeNull()
            expect(result.message).toBe("Cuento terminado agregado correctamente")
            expect(result.obtained_video).not.toBeNull()
            expect(result.tale_title.toString()).toBe((await controller.getOneTale(tales_completed.tale_id)).title)
            expect(result.user_wallet.toString()).toContain(await walletService.getWallet(req.user.userId))

        })

        it('Should not add a tale to completed if already exists', async () =>{

            const result = await controller.addTaleCompleted(tales_completed,req)

            const user_videos = (await userProfileService.getProfile(req.user.userId)).user_videos[0]

            expect(result).not.toBeNull()
            expect(result.message).toBe('Cuento terminado anteriormente')
            expect(result.tale_title.toString()).toBe((await controller.getOneTale(tales_completed.tale_id)).title)
            expect(result.obtained_video._id).toEqual(user_videos._id)
            expect(result.obtained_video._videoId).toEqual(user_videos._videoId)
            expect(result.user_wallet.toString()).toContain(await walletService.getWallet(req.user.userId))

        })
    })

    describe('# Get Tales Completed', () =>{

        it('Should retrieve list of tales of a tale from tales', async () =>{

            const result = await controller.getTalesCompleted(req,'1')

            expect(result).not.toBeNull()
            expect(result.data.length).toBe(2)
            expect(result.currentPage).toBe(1)
            expect(result.lastPage).toBe(1)
            expect(result.perPage).toBe(4)

        })

        it('Should retrieve list of tales and validated field if user has completed or not the tale', async () =>{

            const result = await controller.getTalesCompleted(req,'1')

            expect(result).not.toBeNull()
            expect(result.data[0].times_read).toBeTruthy()
            expect(result.data[1].times_read).toBeFalsy()

        })

        it('Should retrieve list of tales and validated field if user has added as favorite or not the tale', async () =>{

            //Adding a tale to favorite for test
            await controller.addFavoriteTale(tale._id.toString(),req)

            const result: any = await controller.getTalesCompleted(req,'1')

            expect(result).not.toBeNull()
            expect(result.data[0].added_as_favorite).toBeTruthy()
            expect(result.data[1].added_as_favorite).toBeFalsy()

        })

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
