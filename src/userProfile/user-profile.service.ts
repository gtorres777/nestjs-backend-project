// Project libraries
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Project files
import {BaseResponse} from 'src/helpers/BaseResponse';
import getWeek from 'src/helpers/getWeek';
import getHours from 'src/helpers/getHours';
import getMinutes from 'src/helpers/getMinutes';
import getPercentage from 'src/helpers/getPercentage';
import { VideosService } from 'src/videos/videos.service';
import {WalletService} from 'src/wallet/wallet.service';
import { CreateProfileUserDto } from './dtos/user-profile.dto';
import { ProfileUser, VideoReference, SuscriptionState } from './interface/user-profile.interface';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel('ProfileUser') private profileUserModel: Model<ProfileUser>,
    @InjectModel('VideoReference') private videoReferenceModel: Model<VideoReference>,
    private videoService: VideosService,
    private walletService: WalletService,
  ) {}

  async getProfile(userId: string): Promise<ProfileUser> {

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else {

      const userprofile = await this.profileUserModel.findOne({ _user: userId })

      if (!userprofile) {

        throw new NotFoundException('No userprofile found for the given user')

      } else {

        return userprofile

      }

    }

  }

  async addProfile(
    profileUser: CreateProfileUserDto,
    idUser: string,
  ): Promise<ProfileUser> {

    if (!idUser) {

      throw new BadRequestException('Missing ID from user')

    } else if (!profileUser) {

      throw new BadRequestException('Missing profileUser info to create')

    } else {

      const profile = new this.profileUserModel({ ...profileUser, _user: idUser });

      return await profile.save();

    }

  }

  async getRandomVideo(user_videos:VideoReference[]): Promise<VideoReference> {

    //TODO  FALTA VALIDAR QUE EL NUMERO DE VIDEOS SEA SIEMPRE MAYOR A LA CANTIDAD DE CUENTOS

    if (!user_videos){

      throw new BadRequestException('Missing User videos list')

    } else {

      if (user_videos.length>0) {

        let not_repeated_video_obtained:any

        do {

          not_repeated_video_obtained = await this.videoService.getRandomVideoId()

          const found = user_videos.some( video => video._videoId.toString() === not_repeated_video_obtained._VideoId.toString())

          if(!found){
            break;
          }

        } while ( true  )

        const videoReference = new this.videoReferenceModel({
          _videoId: not_repeated_video_obtained._VideoId,
          _url: not_repeated_video_obtained._url,
          video_title: not_repeated_video_obtained.video_title,
          date: new Date(),
          state: SuscriptionState.ACTIVE,
          time_left: "24 horas"
        })

        return await videoReference.save()

      } else {

        const videoId = await this.videoService.getRandomVideoId()

        const videoReference = new this.videoReferenceModel({
          _videoId: videoId._VideoId,
          _url: videoId._url,
          video_title: videoId.video_title,
          date: new Date(),
          state: SuscriptionState.ACTIVE,
          time_left: "24 horas"
        })

        return await videoReference.save()

      }
      // currentProfile.user_videos.push(videoReference)

    }
  }

  async getAllVideos(id: string): Promise<VideoReference[]> {

    if (!id) {

      throw new BadRequestException('Missing ID from user')

    } else {

      const profile = await this.profileUserModel.findOne({ _user: id });

      if (!profile) {

        throw new NotFoundException('No profile found for the given user')

      } else {

        profile.user_videos.map((item) => {

          const hours = getHours(item.date)

          const minutes = getMinutes(item.date)

          if (hours >= 24) {

            item.state = SuscriptionState.INACTIVE
            item.time_left = "Se acabó tu tiempo"

          } else {

            if ((24 - hours).toString().startsWith("0."))
              item.time_left = `${Math.round(1440 - minutes + 1)} minutos`
            else
              item.time_left = `${Math.round(24 - hours)} horas`

          }

        })

        const profileUpdated = await profile.save()

        return profileUpdated.user_videos

      }


    }

  }


  async buyTimeForVideo(videoId: string, userId: string, coins: number) : Promise<BaseResponse>{

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else if (!videoId) {

      throw new BadRequestException('Missing ID from video')

    } else if (!coins) {

      throw new BadRequestException('Missing number of coins')

   } else {

     //COINS
     const wallet = await this.walletService.checkCoins(userId,coins);

     if (!wallet){

       return {
         status: 301,
         message: 'No cuenta con las monedas suficientes',
         data: await this.getAllVideos(userId)

       }

     } else {

       const userprofile = await this.profileUserModel.findOne({ _user: userId });

       if (!userprofile) {

         throw new NotFoundException('No userprofile found for the given user')

       } else {

         const video = userprofile.user_videos.filter(item => item._videoId == videoId)[0]

         if (!video){

           throw new NotFoundException('No video found for the given videoId')

         } else {

           // const test = new Date("2021-03-16T18:43:13.308Z");
           const time_user_video = video.date

           const wallet_substract = await this.walletService.substractCoinsToWallet(userId,coins);

           if(getHours(time_user_video) >= 24)
             video.date = new Date()
           else
             video.date = new Date(video.date.getTime() + (24 * 60 * 60 * 1000))

           video.state = SuscriptionState.ACTIVE
           await userprofile.save()

           return {
             status: 201,
             message: `Video actualizado y ${wallet_substract.message}`,
             data: await this.getAllVideos(userId)
           }

         }


       }

     }
   }

  }

  async getStadistics(userId: string): Promise<BaseResponse>{

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else {

      const userprofile = await this.getProfile(userId);

      /////////////////////////Variables to return///////////////////////////////
      const total_tales_readed = userprofile.tales_completed.length

      //TODAY
      let today_tales_readed:number = 0
      //WEEK
      let week_tales_readed:number = 0
      ///////////////////////////////////////////////////////////////////////////

      let total_questions_today:number = 0
      let answered_correctly_today:number = 0

      let total_questions_week:number = 0
      let answered_correctly_week:number = 0

      //DATES
      const today = new Date()
      const current_week = new Date()

      const stadistics = userprofile.tales_completed.map(tale =>{

        if(tale.createdAt.getDay() == today.getDay()){
          today_tales_readed ++
          total_questions_today += Number(tale.answered_correctly) + Number(tale.answered_incorrectly)
          answered_correctly_today += Number(tale.answered_correctly)
        }

        if(getWeek(tale.createdAt) == getWeek(current_week)){
          week_tales_readed ++
          total_questions_week += Number(tale.answered_correctly) + Number(tale.answered_incorrectly)
          answered_correctly_week += Number(tale.answered_correctly)
        }

      })

      const hit_percentaje_today = getPercentage(total_questions_today, answered_correctly_today)
      const hit_percentaje_week = getPercentage(total_questions_week, answered_correctly_week)

      return {
        status: 201,
        message: "Datos obtenidos correctamente",
        stadistics: {
          today:{
            today_tales_readed: today_tales_readed,
            hit_percentaje_today: hit_percentaje_today
          },
          week:{
            week_tales_readed: week_tales_readed,
            hit_percentaje_week: hit_percentaje_week
          },
          total_tales: total_tales_readed
        }
      }
    }

  }

  // async updateVideTime(videoId: string, userId: string) : Promise<ProfileUser> {

  //   if (!videoId) {

  //     throw new BadRequestException('Missing ID from video')

  //   } else if (!userId) {

  //     throw new BadRequestException('Missing ID from user')

  //   } else {

  //     const userprofile = await this.getProfile(userId);

  //     const video = userprofile.user_videos.filter(item => item._videoId == videoId)[0]

  //     video.date = new Date(video.date.getTime() + (24 * 60 * 60 * 1000))
  //     video.state = SuscriptionState.ACTIVE
  //     // video.set("state", SuscriptionState.ACTIVE)
  //     // video.set("")
  //     return await userprofile.save()

  //   }

  // }

}
