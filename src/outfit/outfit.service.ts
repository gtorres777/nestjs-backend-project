// Project libraries
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Project files
import { CreateOutfitDto } from './dtos/outfit.dto';
import { Outfit } from './interface/outfit.interface';
import { ListOfSet } from 'src/avatar/interface/avatar.interface';

@Injectable()
export class OutfitService {

    constructor(@InjectModel("Outfit") private outfitModel: Model<Outfit>) {}

    async addNewOutfit(data: CreateOutfitDto): Promise<Outfit> {

        if (!data){

            throw new BadRequestException('null body values')

        } else {

            const outfits = await this.getAllOutfit()

            const outfits_names = outfits.map( outfit => outfit.outfit_name )

            if ( outfits_names.includes(data.outfit_name)) {
                return null
            } else {
                const outfit = new this.outfitModel(data)
                return outfit.save()
            }

        }

    }

    async getOneOutfit(outfitId: string): Promise<Outfit> {

        if (!outfitId){
            throw new BadRequestException('No outfitId value given')
        } else {

            const outfit = await this.outfitModel.findById(outfitId)

            if (!outfit){
                throw new NotFoundException('No outfit found')
            } else {
                return outfit
            }
        }

    }

    async getAllOutfit(): Promise<Outfit[]> {
        return this.outfitModel.find({})
    }

}
