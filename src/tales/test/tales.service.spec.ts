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

describe('TalesService', () => {

    let service: TalesService;

    let tale: Tales

    let tales_completed: CreateTalesCompletedDto

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

        service = module.get<TalesService>(TalesService);

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

    });

    it('should be defined', () => {
        expect(service).toBeDefined();

    });

    describe('# Add Tale', () =>{

        it('Should not add tale if null body values', async () =>{

            try {

                await service.addTales(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)

            }

        })


        it('Should add Tale ', async () =>{

            tale  = await (await service.addTales(new_tale)).toObject()

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
            await service.addTales(new_tale2)
        })

    })

    describe('# Update Tale', () =>{

        it('Should not update tale if null body values', async () =>{

            try {

                await service.updateTales(null,tale._id)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not update tale if missing ID from tale', async () =>{

            try {

                await service.updateTales(new_tale_for_update,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from tale')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should update a Tale ', async () =>{

            const result = await (await service.updateTales(new_tale_for_update, tale._id)).toObject()

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

        it('Should not get info of a tale if missing ID from tale', async () =>{

            try {

                await service.getOneTale(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from tale')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not get info of a tale if not found', async () =>{

            //// Just passing a fake ID like idUser
            try {

                await service.getOneTale(idUser)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No tale found for the given tale ID')
                expect(error.response.statusCode).toEqual(404)

            }

        })

        it('Should get info of a Tale ', async () =>{

            const result = await (await service.getOneTale(tale._id)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.content.toString()).toContain(new_tale_for_update.content)
            expect(result.title).toBe(new_tale_for_update.title)

        })

    })

    describe('# Add Favorite Tale', () =>{

        it('Should not add a tale as favorite if missing ID from user', async () =>{

            try {

                await service.addFavoriteTale(tale._id,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not add a tale as favorite if missing ID from tale', async () =>{

            try {

                await service.addFavoriteTale(null,idUser)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from tale')
                expect(error.response.statusCode).toEqual(400)

            }

        })


        it('Should add a tale to favorites', async () =>{

            const result = await service.addFavoriteTale(tale._id.toString(),req.user.userId)

            expect(result).not.toBeNull()
            expect(result.status).toBe(202)
            expect(result.message).toBe('Cuento favorito agregado correctamente')

        })

        it('Should not add a tale to favorites if already exists', async () =>{

            const result = await service.addFavoriteTale(tale._id.toString(),req.user.userId)

            expect(result).not.toBeNull()
            expect(result.status).toBe(202)
            expect(result.message).toBe('Ya tiene agregado este cuento a sus favoritos')

        })
    })

    describe('# Get Favorite Tales', () =>{

        it('Should not get info of a tale from favorite if missing ID from user', async () =>{

            try {

                await service.getFavoriteTales(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should retrieve info of a tale from favorites', async () =>{

            const result:any = await service.getFavoriteTales(req.user.userId)

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

        it('Should not remove a tale as favorite if missing ID from user', async () =>{

            try {

                await service.removeFavoriteTale(tale._id,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not remove a tale as favorite if missing ID from tale', async () =>{

            try {

                await service.removeFavoriteTale(null,idUser)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from tale')
                expect(error.response.statusCode).toEqual(400)

            }

        })


        it('Should remove a tale from favorites', async () =>{

            const result = await service.removeFavoriteTale(tale._id.toString(),req.user.userId)

            expect(result).not.toBeNull()
            expect(result.status).toBe(204)
            expect(result.message).toBe('Cuento favorito removido correctamente')

        })

        it('Should not remove a tale from favorites if not found', async () =>{

            const result = await service.removeFavoriteTale(tale._id.toString(),req.user.userId)

            expect(result).not.toBeNull()
            expect(result.status).toBe(205)
            expect(result.message).toBe('Id de cuento no encontrado')

        })
    })

    describe('# Add Tale Completed', () =>{

        it('Should not add a tale as completed if null body values given', async () =>{

            tales_completed = {
                tale_id: tale._id.toString(),
                answered_correctly: '2',
                answered_incorrectly: '3'
            }

            try {

                await service.addTaleCompleted(null,req.user.userId)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not add a tale as completed if missing ID from user', async () =>{

            try {

                await service.addTaleCompleted(tales_completed,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })


        it('Should add a tale as completed', async () =>{

            const result = await service.addTaleCompleted(tales_completed,req.user.userId)

            expect(result).not.toBeNull()
            expect(result.status).toBe(202)
            expect(result.message).toBe("Cuento terminado agregado correctamente")
            expect(result.video_obtained).not.toBeNull()
            expect(result.tale_title).toBe((await service.getOneTale(tales_completed.tale_id)).title)

        })

        it('Should not add a tale to completed if already exists', async () =>{

            const result = await service.addTaleCompleted(tales_completed,req.user.userId)

            const user_videos = (await userProfileService.getProfile(req.user.userId)).user_videos[0]

            expect(result).not.toBeNull()
            expect(result.status).toBe(201)
            expect(result.message).toBe('Cuento terminado anteriormente')
            expect(result.video_obtained._id).toEqual(user_videos._id)
            expect(result.video_obtained._videoId).toEqual(user_videos._videoId)

        })
    })

    describe('# Get Tales Completed', () =>{

        it('Should not retrieve info from tales if missing ID from user', async () =>{

            try {

                await service.getTalesCompleted(null,1)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should not retrieve info from tales if missing numer of page', async () =>{

            try {

                await service.getTalesCompleted(req.user.userId,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing number of page')
                expect(error.response.statusCode).toEqual(400)

            }

        })

        it('Should retrieve list of tales of a tale from tales', async () =>{

            const result = await service.getTalesCompleted(req.user.userId,1)

            expect(result).not.toBeNull()
            expect(result.data.length).toBe(2)
            expect(result.currentPage).toBe(1)
            expect(result.lastPage).toBe(1)
            expect(result.perPage).toBe(4)

        })

        it('Should retrieve list of tales and validated field if user has completed or not the tale', async () =>{

            const result = await service.getTalesCompleted(req.user.userId,1)

            expect(result).not.toBeNull()
            expect(result.data[0].times_read).toBeTruthy()
            expect(result.data[1].times_read).toBeFalsy()

        })

        it('Should retrieve list of tales and validated field if user has added as favorite or not the tale', async () =>{

            //Adding a tale to favorite for test
            await service.addFavoriteTale(tale._id.toString(),req.user.userId)

            const result: any = await service.getTalesCompleted(req.user.userId,1)

            expect(result).not.toBeNull()
            expect(result.data[0].added_as_favorite).toBeTruthy()
            expect(result.data[1].added_as_favorite).toBeFalsy()

        })

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
