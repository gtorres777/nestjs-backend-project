import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose'

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { WalletService } from '../wallet.service';
import { CreateWalletDto } from '../dtos/wallet.dto';
import { WalletSchema } from '../models/wallet.schema';

describe('WalletService', () => {
    let service: WalletService;
    // const new_wallet: CreateWalletDto = {
    // }

    beforeEach(async () => {
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

    describe('#create', () => {

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
