import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { time } from 'console';
import { Model } from 'mongoose';
import {BaseResponse} from 'src/helpers/BaseResponse';
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

  async getProfile(id: string): Promise<ProfileUser> {
    return this.profileUserModel.findOne({ _user: id });
  }

  async addProfile(
    profileUser: CreateProfileUserDto,
    idUser: string,
  ): Promise<ProfileUser> {
    const profile = new this.profileUserModel({ ...profileUser, _user: idUser });
    return await profile.save();
  }

  async attachRandomVideo(): Promise<VideoReference> {
    const videoReference = new this.videoReferenceModel({
      _videoId: await this.videoService.getRandomVideoId(),
      date: new Date(),
      state: SuscriptionState.ACTIVE,
      time_left: "24 horas"
    })
    // currentProfile.user_videos.push(videoReference)
    return await videoReference.save()
  }

  async getAllVideos(id: string): Promise<VideoReference[]> {
    const profile = await this.profileUserModel.findOne({ _user: id });
    profile.user_videos.map((item) => {
      const hours = this.getHours(item.date)
      const minutes = this.getMinutes(item.date)
      if (hours >= 24) {
        item.state = SuscriptionState.INACTIVE
        item.time_left = "Se acabó tu tiempo"
      } else {
        if ((24 - hours).toString().includes("0.")) 
          item.time_left = `${Math.round(1440 - minutes + 1)} minutos`
        else 
          item.time_left = `${Math.round(24 - hours)} horas`
      }
    })
    const profileUpdated = await profile.save()
    return profileUpdated.user_videos
  }

  getHours(date: Date): number {
    const currentDate:Date = new Date()
    const TO_HOURS = 1000 * 60 * 60
    return (currentDate.valueOf() - date.valueOf())/TO_HOURS
  }

  getMinutes(date: Date): number {
    const currentDate:Date = new Date()
    const TO_HOURS = 1000 * 60
    return (currentDate.valueOf() - date.valueOf())/TO_HOURS
  }

  async buyTimeForVideo(videoId: string, userId: string, coins: number) : Promise<BaseResponse>{
    //COINS
    const wallet = await this.walletService.substractCoinsToWallet(userId,coins);
    console.log("bfd",wallet)
    if (wallet.status == 301){
      return {
        status: 301,
        message: wallet.message,
        data: await this.getAllVideos(userId)
        
      }
    }else{
    const userprofile = await this.profileUserModel.findOne({ _user: userId });
    const video = userprofile.user_videos.filter(item => item._videoId == videoId)[0]
    // const test = new Date("2021-03-16T18:43:13.308Z");
    const time_user_video = video.date

    if(this.getHours(time_user_video) >= 24)
      video.date = new Date()
    else
      video.date = new Date(video.date.getTime() + (24 * 60 * 60 * 1000))

    video.state = SuscriptionState.ACTIVE
    await userprofile.save()

      return {
        status: 201,
        message: `Video actualizado y ${wallet.message}`,
        data: await this.getAllVideos(userId)
      }
    }
  }

}
