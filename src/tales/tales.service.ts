import { Injectable } from '@nestjs/common';
import { CreateTalesDto } from './dto/tales.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { CreateTalesCompletedDto } from 'src/userProfile/dtos/user-profile.dto';
import { ProfileUser, TalesCompleted } from 'src/userProfile/interface/user-profile.interface';

@Injectable()
export class TalesService {
  constructor(
    @InjectModel('Tales') private talesModel: Model<Tales>,
    @InjectModel('TalesCompleted') private talesCompleted: Model<TalesCompleted>,
    private userProfileService: UserProfileService
  ) { }

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
    return await this.talesModel.findById(id, 'content title _id');
  }

  // async getAll(): Promise<Tales[]> {
  //   return await this.talesModel.find({})
  // }

  async getTalesCompleted(): Promise<Tales[]> {
    return await this.talesModel.find({})
  }

  // async getQuestions(tale_id: string): Promise<Tales> {
  //   return await this.talesModel.findById(tale_id)
  //   .select('questions._id questions.question questions.alternative questions.correct_answer') 
  //TODO Preguntar a chalo si el correct answer va o no va
  // }

  async addFavoriteTale(tale_id: string, userid: string): Promise<any> {
    const userprofile = await this.userProfileService.getProfile(userid);
    const favorite_tales_array: string[] = userprofile.favorite_tales;
    favorite_tales_array.push(tale_id);
    return await userprofile.save();
  }

  async addTaleCompleted(data: CreateTalesCompletedDto, userid: string): Promise<ProfileUser> {
    const userprofile = await this.userProfileService.getProfile(userid);

    const aeaMano = userprofile.tales_completed.find(tale => data.tale_id === tale.tale_id)
    if (aeaMano) {
      //ACTUALIZAR
      aeaMano.times_read++
    } else {
      const talesComplete = new this.talesCompleted({
        tale_id: data.tale_id,
        answered_correctly: data.answered_correctly,
        answered_incorrectly: data.answered_incorrectly,
        times_read: 1
      })
      const talesCompleteSave = await talesComplete.save()
      userprofile.tales_completed.push(talesCompleteSave)
    }

    return await userprofile.save();
  }


}
