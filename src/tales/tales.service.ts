import { Injectable } from '@nestjs/common';
import { CreateTalesDto } from './dto/tales.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';

@Injectable()
export class TalesService {
  constructor(@InjectModel('Tales') private talesModel: Model<Tales>) {}

  async addTales(tales: CreateTalesDto): Promise<Tales> {
    const createdTales = new this.talesModel(tales);
    return await createdTales.save();
  }

  async updateTales(tales: UpdateTalesDto, id: string): Promise<Tales> {
    return await this.talesModel.findOneAndUpdate({ _id: id }, <Tales>tales, {
      new: true,
    });
  }

  async getOneTale(id: string): Promise<Tales> {
    return await this.talesModel.findById(id, 'content title _id' );
  }

  async getAll(): Promise<Tales[]> {
    return await this.talesModel.find({})
  }

  async getTalesCompleted(): Promise<Tales[]> {
    return await this.talesModel.find({}, '_id title')
  }

  async getQuestions(tale_id: string): Promise<Tales> {
    return await this.talesModel.findById(tale_id)
    .select('questions._id questions.question questions.alternative questions.correct_answer') 
    //TODO Preguntar a chalo si el correct answer va o no va
  }
}
