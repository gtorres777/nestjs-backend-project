import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { closeInMongodConnection, rootMongooseTestModule } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { OutfitService } from '../outfit.service';
import { CreateOutfitDto } from '../dtos/outfit.dto';
import { ListOfSet } from 'src/avatar/interface/avatar.interface';
import { OutfitSchema } from '../models/outfit.schema';

describe('OutfitService', () => {

    let service: OutfitService;

    const new_outfit: CreateOutfitDto = {
        outfit_image: 'http://zorro-tuxedo',
        outfit_name: ListOfSet.TUXEDO,
        price: 30,
    }

    const new_outfit2: CreateOutfitDto = {
        outfit_image: 'http://zorro-cowboy',
        outfit_name: ListOfSet.COWBOY,
        price: 45,
    }

    const new_outfit3: CreateOutfitDto = {
        outfit_image: 'http://zorro-astronaut',
        outfit_name: ListOfSet.ASTRONAUT,
        price: 75,
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{ name: 'Outfit', schema: OutfitSchema }]),
            ],
            providers: [OutfitService],
        }).compile();

        service = module.get<OutfitService>(OutfitService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('# addOutfit', () => {

        it('should not add new outfit with null body values', async () => {

            expect.assertions(3)

            try {

                await service.addNewOutfit(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('null body values')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should not add new outfit with same outfit_name from ListOfSet', async () => {

            await service.addNewOutfit(new_outfit)
            expect( await service.addNewOutfit(new_outfit) ).toBeNull()

        })

        it('should add new Outfit', async () => {

            const outfit = await service.addNewOutfit(new_outfit2)
            expect(outfit).not.toBeNull();
            expect(outfit._id).not.toBeNull();
            expect(outfit.outfit_image).toEqual(new_outfit2.outfit_image)
            expect(outfit.outfit_name).toEqual(new_outfit2.outfit_name)
            expect(outfit.price).toEqual(new_outfit2.price)

        });
    })

    describe('# GetOne Outfit', () => {

        it('should not retrieve outfit if not found', async () => {

            const fake_not_existing_outfitId = '6090bdf7964b4000209c2b34'

            try {

                await service.getOneOutfit(fake_not_existing_outfitId)

            } catch (error) {

                expect(error.response.error).toEqual('Not Found')
                expect(error.response.message).toEqual('No outfit found')
                expect(error.response.statusCode).toEqual(404)
            }

        })

        it('should not retrieve an outfit with outfitId empty value', async () => {

            expect.assertions(3)

            try {

                await service.getOneOutfit(null)

            } catch (error) {

                expect(error.response.error).toEqual('Bad Request')
                expect(error.response.message).toEqual('No outfitId value given')
                expect(error.response.statusCode).toEqual(400)
            }

        })

        it('should find and retrieve info of one Outfit by passing an OutfitId', async () => {

            //Creating an outfit for testing
            const outfit = await service.addNewOutfit(new_outfit3)

            //Testing the method getOneOutfit
            const outfit_found = await service.getOneOutfit(outfit._id)
            expect(outfit_found).not.toBeNull()
            expect(outfit_found._id).toEqual(outfit._id);
            expect(outfit_found.outfit_image).toEqual(outfit.outfit_image)
            expect(outfit_found.outfit_name).toEqual(outfit.outfit_name)
            expect(outfit_found.price).toEqual(outfit.price)

        })
    })

    describe('# Get all Outfits', () => {

        it('should retrieve all the info of the available outfits', async () => {

            const all_outfits = await service.getAllOutfit()
            expect(all_outfits).not.toBeNull()
            expect(all_outfits).toHaveLength(3)
        })
    })

    afterAll(async () => {
        await closeInMongodConnection();
    });
});
