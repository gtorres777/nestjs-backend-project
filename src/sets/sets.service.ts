import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sets } from './interface/sets.interface';
import {CreateSetsDto} from "./dtos/sets.dto"

@Injectable()
export class SetsService {

    constructor(@InjectModel("Sets") private setsModel: Model<Sets>) {}

    async addNewSet(data: CreateSetsDto): Promise<Sets> {
        const set = new this.setsModel(data)
        return await set.save()
    }

    async getOneSet(setId: string): Promise<Sets> {
        const set = await this.setsModel.findById(setId)
        return set
    }

}
