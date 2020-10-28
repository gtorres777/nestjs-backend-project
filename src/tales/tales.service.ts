import { Injectable } from '@nestjs/common';
import {CreateTalesDto} from './dto/tales.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tales } from './interface/tales.interface';

@Injectable()
export class TalesService {

  constructor(
    @InjectModel('Tales') private talesModel: Model<Tales>
  ) {  }

  async addTales(tales: CreateTalesDto): Promise<Tales> {
    const createdTales = new this.talesModel(tales)
    return await createdTales.save()
  }
}
