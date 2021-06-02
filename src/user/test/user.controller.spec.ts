import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserSchema } from '../models/user.schema';
import { ProfileUserSchema, VideoReferenceSchema } from 'src/userProfile/models/user-profile.schema';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { VideoSchema } from 'src/videos/model/video.schema';
import { AvatarSchema } from 'src/avatar/models/avatar.schema';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { WalletService } from 'src/wallet/wallet.service';
import { AvatarService } from 'src/avatar/avatar.service';
import { AuthService } from 'src/auth/services';
import { VideosService } from 'src/videos/videos.service';
import { OutfitService } from 'src/outfit/outfit.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { new_user, new_user2 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('UserController', () => {

    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'User', schema: UserSchema },
                    { name: 'ProfileUser', schema: ProfileUserSchema },
                    { name: 'VideoReference', schema: VideoReferenceSchema },
                    { name: 'Wallet', schema: WalletSchema },
                    { name: 'Videos', schema: VideoSchema },
                    { name: 'Avatar', schema: AvatarSchema },
                    { name: 'Outfit', schema: OutfitSchema },
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
            controllers: [UserController],
            providers: [
                UserService,
                UserProfileService,
                WalletService,
                AvatarService,
                AuthService,
                VideosService,
                OutfitService
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    describe('# addUser', () => {

        it('should not create user with null body values', async () => {

            expect.assertions(3)

            try {

                await controller.addUser(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)

            }
        })

        it('should add a user', async () => {

            const user = await controller.addUser(new_user)
            expect(user).not.toBeNull();
            expect(user._id).not.toBeNull();
            expect(user.name).toEqual(new_user.name)
            expect(user.email).toEqual(new_user.email)

        });

        it('should not create user with an existing email', async () => {

            try{

                await controller.addUser(new_user)

            } catch (error) {

                expect(error).not.toBeNull()
            }

        });

        it('should return access_token', async () => {

            const user = await controller.addUser(new_user2)
            expect(user).not.toBeNull();
            expect(user._id).not.toBeNull();
        });

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
