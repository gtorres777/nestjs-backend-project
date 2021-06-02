import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { WalletService } from '../wallet.service';
import { CreateWalletDto } from '../dtos/wallet.dto';
import { WalletSchema } from '../models/wallet.schema';
import { idUser, idUser_to_fail } from 'src/helpers/test-utils/fake-data/fake-data';

describe('WalletService', () => {

    let service: WalletService;

    const new_wallet: CreateWalletDto = {
        _user: idUser,
        total_coins:0
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }]),
            ],
            providers: [WalletService],
        }).compile();

        service = module.get<WalletService>(WalletService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('# Add Wallet', () => {

        it('should not add wallet without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.addWallet(new_wallet,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing Id from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not add wallet without CreateWalletDto values', async () => {

            expect.assertions(3)

            try {

                await service.addWallet(null,idUser)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing user info to create wallet')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should add Wallet', async () => {

            const wallet = await service.addWallet(new_wallet,idUser)
            expect(wallet).not.toBeNull();
            expect(wallet._id).not.toBeNull();
            expect(wallet._user.toString()).toEqual(new_wallet._user)
            expect(wallet.total_coins).toEqual(new_wallet.total_coins)

        });

    })

    describe('# Get Wallet', () => {

        it('should not retrieve wallet info without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.getWallet(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing Id from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not retrieve wallet info if not found', async () => {

            expect.assertions(3)

            try {

                await service.getWallet(idUser_to_fail)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No wallet found for the given user')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should retrieve Wallet info from a user', async () => {

            const wallet = await service.getWallet(idUser)
            expect(wallet).not.toBeNull();
            expect(wallet._id).not.toBeNull();
            expect(wallet._user.toString()).toEqual(new_wallet._user)
            expect(wallet.total_coins).toEqual(new_wallet.total_coins)

        });

    })

    describe('# Add Coins to Wallet', () => {

        it('should not add coins to wallet without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.addCoinsToWallet(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing Id from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not add coins to wallet if not found', async () => {

            expect.assertions(3)

            try {

                await service.addCoinsToWallet(idUser_to_fail)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No wallet found for the given user')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should add coins to a Wallet from a user', async () => {

            const result = await service.addCoinsToWallet(idUser)
            expect(result).not.toBeNull();
            expect(result.status).toEqual(201)
            expect(result.message).toEqual("Monedas agregadas correctamente")

        });

    })

    describe('# Substract Coins to Wallet', () => {

        it('should not substract coins to wallet without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.substractCoinsToWallet(null,2)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing Id from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not substract coins to wallet without coins quantity given', async () => {

            expect.assertions(3)

            try {

                await service.substractCoinsToWallet(idUser,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing coins quantity')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not substract coins to wallet if not found', async () => {

            expect.assertions(3)

            try {

                await service.substractCoinsToWallet(idUser_to_fail,1)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No wallet found for the given user')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should not substract coins to a Wallet from a user if the user doesnt have enough coins', async () => {

            const result = await service.substractCoinsToWallet(idUser,4)
            expect(result).not.toBeNull();
            expect(result.status).toEqual(301)
            expect(result.message).toEqual("No cuenta con las monedas suficientes")

        });

        it('should substract coins to a Wallet from a user', async () => {

            const result = await service.substractCoinsToWallet(idUser,1)
            expect(result).not.toBeNull();
            expect(result.status).toEqual(201)
            expect(result.message).toEqual("Monedas restadas correctamente")

        });
    })

    describe('# Check Coins', () => {

        it('should not pass without Id from user', async () => {

            expect.assertions(3)

            try {

                await service.checkCoins(null,2)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing Id from user')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not pass without coins quantity given', async () => {

            expect.assertions(3)

            try {

                await service.checkCoins(idUser,null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('Missing coins quantity')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not pass if wallet from given user not found', async () => {

            expect.assertions(3)

            try {

                await service.checkCoins(idUser_to_fail,1)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No wallet found for the given user')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should not pass if the user doesnt have enough coins and return false', async () => {

            const result = await service.checkCoins(idUser,4)
            expect(result).not.toBeNull();
            expect(result).toBeFalsy()

        });

        it('should retrieve true', async () => {

            const result = await service.checkCoins(idUser,1)
            expect(result).not.toBeNull();
            expect(result).toBeTruthy()

        });
    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
