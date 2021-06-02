import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { OutfitController } from '../outfit.controller';
import { OutfitSchema } from '../models/outfit.schema';
import { OutfitService } from '../outfit.service';
import { CreateOutfitDto } from '../dtos/outfit.dto';
import { ListOfSet } from 'src/avatar/interface/avatar.interface';
import { new_outfit3 } from 'src/helpers/test-utils/fake-data/fake-data';

describe('OutfitController', () => {

    let controller: OutfitController;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'Outfit', schema: OutfitSchema }]),
            ],
            controllers: [OutfitController],
            providers: [OutfitService],
        }).compile();

        controller = module.get<OutfitController>(OutfitController);
    });

    describe('CreateOutfit', () => {

        it('should create an Outfit', async () => {
            const result = await controller.createOutfit(new_outfit3)
            expect(result).not.toBeNull()
            expect(result._id).not.toBeNull()
            expect(result.outfit_image).toEqual(new_outfit3.outfit_image)
            expect(result.outfit_name).toEqual(new_outfit3.outfit_name)
            expect(result.price).toEqual(new_outfit3.price)
        });

        it('should not create an Outfit with an existing outfit_name', async () => {
            try {

                await controller.createOutfit(new_outfit3)

            } catch (error) {

                expect(error).not.toBeNull()
                expect(error.response).toEqual('No se puede agregar un mismo tipo de outfit que tenga el mismo nombre que uno existente')
                expect(error.status).toEqual(400)

            }
        });

    })

    describe('GetAll', () => {

        it('should retrieve all outfits', async () => {

            const result = await controller.getAll()
            expect(result).not.toBeNull();
            expect(result).toHaveLength(1)

        });

    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
