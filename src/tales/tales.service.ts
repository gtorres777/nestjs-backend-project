import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
import getHours from 'src/helpers/getHours';

@Injectable()
export class TalesService {
  constructor(
    @InjectModel('Tales') private talesModel: Model<Tales>,
    @InjectModel('TalesCompleted') private talesCompleted: Model<TalesCompleted>,
    private userProfileService: UserProfileService,
    private walletService: WalletService,
  ) { }

  async addTales(tales: CreateTalesDto): Promise<Tales> {

    if (!tales){

      throw new BadRequestException('null body values')

    } else {

      const createdTales = new this.talesModel(tales);
      return await createdTales.save();

    }

  }

  async updateTales(tales: UpdateTalesDto, id: string): Promise<Tales> {

    if (!tales) {

      throw new BadRequestException('null body values')

    } else if (!id) {

      throw new BadRequestException('Missing ID from tale')

    } else {

      return await this.talesModel.findOneAndUpdate({ _id: id }, <Tales>tales, {
        new: true,
      });

    }
  }

  async getOneTale(id: string): Promise<Tales> {

    if (!id) {

      throw new BadRequestException('Missing ID from tale')

    } else {

      const tale = await this.talesModel.findById(id, 'content title _id');

      if (!tale) {

        throw new NotFoundException('No tale found for the given tale ID')

      } else {

        return tale
      }

    }

  }

  async addFavoriteTale(tale_id: string, userid: string): Promise<BaseResponse> {

    if (!userid) {

      throw new BadRequestException('Missing ID from user')

    } else if (!tale_id) {

      throw new BadRequestException('Missing ID from tale')

    } else {

      const userprofile = await this.userProfileService.getProfile(userid);

      const favorite_tales_array: string[] = userprofile.favorite_tales;

      const tale_coincidence = favorite_tales_array.find(tale => tale === tale_id);

      if (tale_coincidence) {

        return{
          status: 202,
          message: "Ya tiene agregado este cuento a sus favoritos",
        }

      } else {

        favorite_tales_array.push(tale_id);

        await userprofile.save();

        return {
          status: 202,
          message: "Cuento favorito agregado correctamente",
        }

      }

    }
  }

  async getFavoriteTales(userId: string): Promise<string[]> {

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else {

      let favoritetales_array_of_objects = []

      const userprofile = await this.userProfileService.getProfile(userId);

      const favorite_tales_array = userprofile.favorite_tales;

      const response = favorite_tales_array.map( async tale => {

        const tale_object = await this.talesModel.findById(tale)
        favoritetales_array_of_objects.push(tale_object)

      })

      await Promise.all(response)

      return favoritetales_array_of_objects;

    }

  }

  async removeFavoriteTale(tale_id: string, userid: string) : Promise<BaseResponse> {

    if (!userid) {

      throw new BadRequestException('Missing ID from user')

    } else if (!tale_id) {

      throw new BadRequestException('Missing ID from tale')

    } else {

      const userprofile = await this.userProfileService.getProfile(userid)

      const favorite_tales_array : string [] = userprofile.favorite_tales

      const favorite_tale_position = favorite_tales_array.indexOf(tale_id)

      if (favorite_tale_position != -1) {

        favorite_tales_array.splice(favorite_tale_position,1)

        await userprofile.save()

        return {
          status: 204,
          message: "Cuento favorito removido correctamente"
        }

      } else {

        return {
          status: 205,
          message: "Id de cuento no encontrado"
        }

      }

    }

  }


  async addTaleCompleted(data: CreateTalesCompletedDto, userid: string): Promise<BaseResponse> {

    if (!data) {

      throw new BadRequestException('null body values')

    } else if (!userid) {

      throw new BadRequestException('Missing ID from user')

    } else {

      const userprofile = await this.userProfileService.getProfile(userid);

      const base_response : BaseResponse = {}

      const validated_tale = userprofile.tales_completed.find(tale => data.tale_id === tale.tale_id)


      if (validated_tale) {
        //ACTUALIZAR
        const tale_update = await this.getOneTale(validated_tale.tale_id)
        validated_tale.times_read++
        base_response.status = 201
        base_response.message = "Cuento terminado anteriormente"
        // base_response.video_obtained = validated_tale.video_obtained
        base_response.tale_title = tale_update.title

      const video = userprofile.user_videos.filter(item => item._videoId.toString() == validated_tale.video_obtained._videoId.toString())[0]

        if(getHours(video.date) >= 24)
          video.date = new Date()
        else
          base_response.video_obtained = video


        video.state = SuscriptionState.ACTIVE

        await userprofile.save()

      } else {

        let user_videos = userprofile.user_videos

        let random_video = await this.userProfileService.getRandomVideo(user_videos)

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

  }

  async getTalesCompleted(userId: string, page: number): Promise<BasePagination<Tales[]>> {

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else if (!page) {

      throw new BadRequestException('Missing number of page')

    } else {

      const LIMIT = 4

      const userprofile = await this.userProfileService.getProfile(userId);

      const userTalesCompleted = userprofile.tales_completed.map(item => item.tale_id)

      const favoriteTales = userprofile.favorite_tales

      const collectionSize = await this.talesModel.count({})

      const allTales = await this.talesModel.find({}).skip((page - 1) * LIMIT).limit(LIMIT)

      const allTalesMapped = allTales.map(item => {

        if (userTalesCompleted.includes(item._id) && favoriteTales.includes(item._id)) {

          return {...item.toObject(), times_read: true , added_as_favorite: true}

        } else if ((userTalesCompleted.includes(item._id) && !favoriteTales.includes(item._id))) {

          return {...item.toObject(), times_read: true, added_as_favorite: false}

        } else if ((!userTalesCompleted.includes(item._id) && favoriteTales.includes(item._id))) {

          return {...item.toObject(), times_read: false, added_as_favorite: true}

        } else {

          return {...item.toObject(), times_read: false, added_as_favorite: false}
        }

      })

      return {
        data: allTalesMapped,
        currentPage: allTales.length > 0 ? page : 1,
        lastPage: allTales.length > 0 ? Math.ceil(collectionSize / LIMIT) : 1,
        perPage: LIMIT
      }

    }

  }


}
