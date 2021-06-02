import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { BuyAvatarSetDto } from '../dtos/avatar.dto';
import { AvatarController } from '../avatar.controller';
import { ListOfSet } from '../interface/avatar.interface';
import { AvatarSchema } from '../models/avatar.schema';
import { AvatarService } from '../avatar.service';
import { WalletService } from 'src/wallet/wallet.service';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { OutfitService } from 'src/outfit/outfit.service';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/models/user.schema';
import { ProfileUserSchema, VideoReferenceSchema } from 'src/userProfile/models/user-profile.schema';
import { VideoSchema } from 'src/videos/model/video.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { VideosService } from 'src/videos/videos.service';
import { AuthService } from 'src/auth/services';
import { Outfit } from 'src/outfit/interface/outfit.interface';
import { new_user, new_outfit, new_outfit2 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('AvatarController', () => {

    let controller: AvatarController;

    let userService: UserService;

    let outfitService: OutfitService


    let req

    let buy_avatar: BuyAvatarSetDto

    let buy_avatar2: BuyAvatarSetDto

    let outfit_cowboy: Outfit

    let outfit_astronaut: Outfit


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
            controllers: [AvatarController],
            providers: [
                AvatarService,
                WalletService,
                OutfitService,
                UserService,
                UserProfileService,
                VideosService,
                AuthService,
            ],
        }).compile();

        controller = module.get<AvatarController>(AvatarController);

        userService = module.get<UserService>(UserService);

        outfitService = module.get<OutfitService>(OutfitService)

        const user_created = await userService.addUser(new_user)

        const user_found = await userService.findOne(user_created.email)

        outfit_cowboy = await outfitService.addNewOutfit(new_outfit)

        outfit_astronaut = await outfitService.addNewOutfit(new_outfit2)

        buy_avatar = {
            set_name: ListOfSet.COWBOY,
            outfitId: outfit_cowboy._id
        }

        buy_avatar2 = {
            set_name: ListOfSet.ASTRONAUT,
            outfitId: outfit_astronaut._id
        }

        req = {
            user: {
                userId: user_found._id,
                username: user_found.email
            }
        }
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();

    });

    describe('# Buy Avatar Set', () => {

        it('should buy Set Avatar', async () => {

            const result: any = await controller.buyAvatarSet(req, buy_avatar )

            expect(result).not.toBeNull()

            expect(result.avatar.avatar_sets).toContain(ListOfSet.DEFAULT)
            expect(result.avatar.avatar_sets).toContain(buy_avatar.set_name)
            expect(result.avatar.current_style).toBe(buy_avatar.set_name)

            expect(result.wallet.total_coins).toBeGreaterThan(0)
        });

        it('should not buy Set Avatar if user already has the same is trying to buy', async () => {

            const result = await controller.buyAvatarSet(req, buy_avatar)

            expect(result).not.toBeNull()

            expect(result.status).toEqual(301)
            expect(result.message).toEqual("El usuario ya cuenta con ese outfit")
        });

        it('should not buy Set Avatar if not enough coins', async () => {

            const result = await controller.buyAvatarSet(req, buy_avatar2 )

            expect(result).not.toBeNull()

            expect(result.status).toEqual(404)
            expect(result.message).toEqual("No cuenta con las monedas suficientes")
        });

    })

    describe('# Equip One Avatar Set', () => {

        it('should Equip One Set Avatar', async () => {

            const result = await controller.equipOneAvatar(req, outfit_cowboy._id  )

            expect(result).not.toBeNull()

            expect(result.avatar_sets).toContain(ListOfSet.DEFAULT)
            expect(result.avatar_sets).toContain(buy_avatar.set_name)
            expect(result.current_style).toBe(buy_avatar.set_name)

        });

    })

    describe('# Get Users Avatar', () => {

        it('should retrieve Users Avatar', async () => {

            const result = (await controller.getUsersAvatar(req)).toObject()

            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result._user).toEqual(req.user.userId)
            expect(result.current_style).toEqual(ListOfSet.COWBOY)
            expect(result.avatar_sets).toContain(ListOfSet.DEFAULT)
            expect(result.avatar_sets).toContain(ListOfSet.COWBOY)

        });

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
