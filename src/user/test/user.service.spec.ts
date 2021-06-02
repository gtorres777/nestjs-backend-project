import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose'

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dtos/user.dto';
import { UserSchema } from '../models/user.schema';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { WalletService } from 'src/wallet/wallet.service';
import { AvatarService } from 'src/avatar/avatar.service';
import { AuthService } from 'src/auth/services';
import { ProfileUserSchema, VideoReferenceSchema } from 'src/userProfile/models/user-profile.schema';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { VideosService } from 'src/videos/videos.service';
import { VideoSchema } from 'src/videos/model/video.schema';
import { AvatarSchema } from 'src/avatar/models/avatar.schema';
import { OutfitService } from 'src/outfit/outfit.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { new_user, new_user2 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('UserService', () => {

    let service: UserService;

    beforeAll(async () => {
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

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('# addUser', () => {

        it('should not create user with null body values', async () => {

            expect.assertions(3)

            try {

                await service.addUser(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should create user', async () => {

            const user = await service.addUser(new_user)
            expect(user).not.toBeNull();
            expect(user._id).not.toBeNull();
            expect(user.name).toEqual(new_user.name)
            expect(user.email).toEqual(new_user.email)

        });

        it('should not create user with an existing email', async () => {

            try{

                await service.addUser(new_user)

            } catch (error) {

                expect(error).not.toBeNull()
            }

        });

        it('should return access_token', async () => {

            const user = await service.addUser(new_user2)

            expect(user).not.toBeNull();
            expect(user._id).not.toBeNull();
            expect(user.access_token).not.toBeNull()

        });
    })

    describe('# findOneUser', () => {

        it('should not retrieve user if not found', async () => {

            const fake_user_email = 'tux3@gmail.com'

            try {

                await service.findOne(fake_user_email)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No user found')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should not retrieve a user with email empty value', async () => {

            expect.assertions(3)

            try {

                await service.findOne(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('No email value given')
                expect(error.response.statusCode).toEqual(400)
            }

        })


        it('should find user', async () => {

            const user_found = await service.findOne(new_user.email)

            expect(user_found).not.toBeNull();
            expect(user_found._id).not.toBeNull();
            expect(user_found.name).toEqual(new_user.name)
            expect(user_found.email).toEqual(new_user.email)
            expect(user_found.password).not.toEqual(new_user.password)

        });
    })

    describe('# Get all Users', () => {

        it('should retrieve all the info of the current Users', async () => {

            const all_users = await service.getAllUsers()
            expect(all_users).not.toBeNull()
            expect(all_users).toHaveLength(2)
        })
    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
