import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { AvatarService } from '../avatar.service';
import { ListOfSet } from '../interface/avatar.interface';
import { AvatarSchema } from '../models/avatar.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { OutfitService } from 'src/outfit/outfit.service';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { Wallet } from 'src/wallet/interface/wallet.interface';
import { Outfit } from 'src/outfit/interface/outfit.interface';
import { new_wallet, new_avatar, new_outfit3, idUser, idUser_to_fail, outfitId_to_fail, new_avatar_for_update } from 'src/helpers/test-utils/fake-data/fake-data';

describe('AvatarService', () => {

    let service: AvatarService;

    let walletService: WalletService;

    let outfitService: OutfitService;

    let wallet: Wallet

    let outfit: Outfit

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: 'Avatar', schema: AvatarSchema },
                    { name: 'Wallet', schema: WalletSchema },
                    { name: 'Outfit', schema: OutfitSchema },
                ]),
            ],
            providers: [AvatarService, WalletService, OutfitService],
        }).compile();

        service = module.get<AvatarService>(AvatarService);

        walletService = module.get<WalletService>(WalletService);

        outfitService = module.get<OutfitService>(OutfitService);

        wallet = await walletService.addWallet(new_wallet,idUser)

        outfit = await outfitService.addNewOutfit(new_outfit3)

    });

    it('should be defined', () => {
        expect(service).toBeDefined();

    });


    describe('# Create Avatar', () => {

        it('should not create Avatar without Id from user', async () => {

            expect.assertions(3)

            try {

                service.createAvatar(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing Id from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should create Avatar for a given user', async () => {

            const result = await (await service.createAvatar(idUser).toPromise()).toObject()
            expect(result).not.toBeNull();
            expect(result._id).not.toBeNull()
            expect(result._user.toString()).toEqual(new_avatar._user)
            expect(result.avatar_name).toEqual('Zorro')
            expect(result.avatar_sets).toStrictEqual(new_avatar.avatar_sets)
            expect(result.current_style).toEqual(new_avatar.current_style)

        });

    })

    describe('# Get Avatar', () => {

        it('should not retrieve Avatar info without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.getAvatar(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not retrieve avatar info if not found', async () => {

            try {

                await service.getAvatar(idUser_to_fail)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No avatar found for the given user')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should retrieve Avatar info for a given user', async () => {

            const result = (await service.getAvatar(idUser)).toObject()

            expect(result).not.toBeNull();
            expect(result._id).not.toBeNull()
            expect(result._user.toString()).toEqual(new_avatar._user)
            expect(result.avatar_name).toEqual('Zorro')
            expect(result.avatar_sets).toStrictEqual(new_avatar.avatar_sets)
            expect(result.current_style).toEqual(new_avatar.current_style)

        });

    })


    describe('# Buy Set Avatar', () => {

        it('should not buy Set Avatar without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.buySetAvatar(null,ListOfSet.COWBOY, outfit._id )

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not buy Set Avatar without name of set', async () => {

            expect.assertions(3)

            try {

                await service.buySetAvatar(idUser,null, outfit._id )

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing name of set')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not buy Set Avatar without ID of avatar', async () => {

            expect.assertions(3)

            try {

                await service.buySetAvatar(idUser,ListOfSet.COWBOY, null )

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from outfit')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not buy Set Avatar if no avatar found for the given user', async () => {

            try {

                await service.buySetAvatar(idUser_to_fail,ListOfSet.COWBOY, outfit._id )

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No avatar found for the given user')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should not buy Set Avatar if no outfit ID found', async () => {

            try {

                await service.buySetAvatar(idUser,ListOfSet.COWBOY, outfitId_to_fail )

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                // this message is sent from outfit.service BadRequestException
                expect(error.response.message).toEqual('No outfit found')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should buy Set Avatar for a given user', async () => {

            // Used any because typescript not recognizing Avatar type
            const result: any = await service.buySetAvatar(idUser,ListOfSet.COWBOY, outfit._id)

            expect(result).not.toBeNull();
            expect(result.current_style).toEqual(ListOfSet.COWBOY)
            expect(result.avatar_sets).toContain(ListOfSet.COWBOY)

        });

        it('should not buy Set Avatar if set Name already exists on Avatar_sets for the given user', async () => {

            const result = await service.buySetAvatar(idUser, ListOfSet.COWBOY, outfit._id )

            expect(result).not.toBeNull()
            expect(result).toBe(301)

        })

        it('should not buy Set Avatar if user doesnt have enough coins', async () => {

            // Now the user just will have 5 coins to spent
            const result = await service.buySetAvatar(idUser, ListOfSet.ASTRONAUT, outfit._id )

            expect(result).toBeNull()

        })

    })

    describe('# Update Avatar', () => {

        it('should not update Avatar without Id from user', async () => {

            expect.assertions(3)

            try {

                const avatar = (await service.getAvatar(idUser)).toObject()

                await service.updateAvatar(null, avatar._id )

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should update Avatar', async () => {


            const avatar = (await service.getAvatar(idUser)).toObject()

            const result = await service.updateAvatar(new_avatar_for_update, avatar._id )

            expect(result).not.toBeNull()
            expect(result.current_style).toBe(new_avatar_for_update.current_style)

        })
    })

    describe('# Equip One Avatar', () => {

        it('should not Equip Avatar without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.equipOneAvatar(null, outfit._id )

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not Equip Avatar without Id from outfit', async () => {

            expect.assertions(3)

            try {

                await service.equipOneAvatar(idUser, null )

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing ID from outfit')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should equip Avatar', async () => {

            const result = await service.equipOneAvatar(idUser, outfit._id )

            expect(result).not.toBeNull()
            expect(result.current_style).toBe(outfit.outfit_name)

        })
    })


    afterAll(async () => {
        await closeInMongodConnection();
    });
});
