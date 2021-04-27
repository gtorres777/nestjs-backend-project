import { Injectable } from '@nestjs/common';
import { CreateTalesDto, UtilsDto } from './dto/tales.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BasePagination, Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';
import { UserProfileService } from 'src/userProfile/user-profile.service';
import { CreateTalesCompletedDto, CreateVideoReference } from 'src/userProfile/dtos/user-profile.dto';
import { ProfileUser, SuscriptionState, TalesCompleted, VideoReference } from 'src/userProfile/interface/user-profile.interface';
import {BaseResponse} from 'src/helpers/BaseResponse';
import {WalletService} from 'src/wallet/wallet.service';

@Injectable()
export class TalesService {
  constructor(
    @InjectModel('Tales') private talesModel: Model<Tales>,
    @InjectModel('TalesCompleted') private talesCompleted: Model<TalesCompleted>,
    private userProfileService: UserProfileService,
    private walletService: WalletService,
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

  async getFavoriteTales(userId: string): Promise<string[]> {
    const userprofile = await this.userProfileService.getProfile(userId);
    const favorite_tales_array = userprofile.favorite_tales;
    return favorite_tales_array;
  }
  // async getAll(): Promise<Tales[]> {
  //   return await this.talesModel.find({})
  // }
  async getTalesCompleted(userId: string, page: number): Promise<BasePagination<Tales[]>> {
    const LIMIT = 4
    const userprofile = await this.userProfileService.getProfile(userId);
    const userTalesCompleted = userprofile.tales_completed.map(item => item.tale_id)
    // const _page = page === 1 ? 0 : page
    const collectionSize = await this.talesModel.count({})
    const allTales = await this.talesModel.find({}).skip((page - 1) * LIMIT).limit(LIMIT)
    const allTalesMapped = allTales.map(item => {
      if (userTalesCompleted.includes(item._id)) {
        return {...item.toObject(), times_read: true}
      } else {
        return {...item.toObject(), times_read: false}
      }
    })
    // await this.talesModel.deleteMany({})
    return {
      data: allTalesMapped,
      currentPage: allTales.length > 0 ? page : 1,
      lastPage: allTales.length > 0 ? Math.ceil(collectionSize / LIMIT) : 1, 
      perPage: LIMIT
    }
  }

  
  // async getQuestions(tale_id: string): Promise<Tales> {
  //   return await this.talesModel.findById(tale_id)
  //   .select('questions._id questions.question questions.alternative questions.correct_answer') 
  //TODO Preguntar a chalo si el correct answer va o no va
  // }

  async addFavoriteTale(tale_id: string, userid: string): Promise<BaseResponse> {
    const userprofile = await this.userProfileService.getProfile(userid);
    const favorite_tales_array: string[] = userprofile.favorite_tales;
    const tale_coincidence = favorite_tales_array.find(tale => tale === tale_id);
    if (tale_coincidence){
      return{
          status: 202,
          message: "Ya tiene agregado este cuento a sus favoritos",
      }
    }else{
      favorite_tales_array.push(tale_id);
      await userprofile.save();
      return {
        status: 202,
        message: "Cuento favorito agregado correctamente",
      }
    }
  }

  async addTaleCompleted(data: CreateTalesCompletedDto, userid: string): Promise<BaseResponse> {
    const userprofile = await this.userProfileService.getProfile(userid);
	const base_response : BaseResponse = {}

    const aeaMano = userprofile.tales_completed.find(tale => data.tale_id === tale.tale_id)
    if (aeaMano) {
	  //ACTUALIZAR
	  const tale_update = await this.getOneTale(aeaMano.tale_id)
	  aeaMano.times_read++
	  base_response.status = 201
	  base_response.message = "Cuento terminado anteriormente"
	  base_response.video_obtained = aeaMano.video_obtained
	  base_response.tale_title = tale_update.title
      await userprofile.save()
	
    } else {
		let user_videos = userprofile.user_videos
		console.log("USERVIDS",user_videos)
        let random_video = await this.userProfileService.attachRandomVideo(user_videos)
        const talesComplete = new this.talesCompleted({
        tale_id: data.tale_id,
        answered_correctly: data.answered_correctly,
        answered_incorrectly: data.answered_incorrectly,
        times_read: 1,
		video_obtained: random_video
      })
	  // data title
	  const new_tale_finished = await this.getOneTale(data.tale_id)
      const talesCompleteSave = await talesComplete.save()
      userprofile.user_videos.push( random_video )
      userprofile.tales_completed.push(talesCompleteSave)
      await userprofile.save()

      //COINS
      await this.walletService.addCoinsToWallet(userid);

	  //base response
	  base_response.status = 202
	  base_response.message = "Cuento terminado agregado correctamente"
	  base_response.video_obtained = random_video
	  base_response.tale_title = new_tale_finished.title
    }


    return base_response;
  }

  async updateVideTime(videoId: string, userId: string) : Promise<ProfileUser> {
    const userprofile = await this.userProfileService.getProfile(userId);
    const video = userprofile.user_videos.filter(item => item._videoId == videoId)[0]
    video.date = new Date(video.date.getTime() + (24 * 60 * 60 * 1000))
    video.state = SuscriptionState.ACTIVE
    // video.set("state", SuscriptionState.ACTIVE)
    // video.set("")
    return await userprofile.save()
  }


}
