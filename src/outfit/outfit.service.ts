import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOutfitDto } from './dtos/outfit.dto';
import { Outfit } from './interface/outfit.interface';

@Injectable()
export class OutfitService {

    constructor(@InjectModel("Outfit") private outfitModel: Model<Outfit>) {}

    async addNewOutfit(data: CreateOutfitDto): Promise<Outfit> {
        const outfit = new this.outfitModel(data)
        return await outfit.save()
    }

    async getOneOutfit(outfitId: string): Promise<Outfit> {
        const outfit = await this.outfitModel.findById(outfitId)
        return outfit
    }

    async getAllOutfit(): Promise<Outfit[]> {
        return await this.outfitModel.find({})
    }

}
