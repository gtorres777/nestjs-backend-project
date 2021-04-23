import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { time } from 'console';
import { Model } from 'mongoose';
import {BaseResponse} from 'src/helpers/BaseResponse';
import getWeek from 'src/helpers/getWeek';
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
	  const videoId = await this.videoService.getRandomVideoId()
	  console.log("AEAA",videoId)
    const videoReference = new this.videoReferenceModel({
      _videoId: videoId._VideoId,
	  _url: videoId._url,
      date: new Date(),
      state: SuscriptionState.ACTIVE,
      time_left: "24 horas"
    })

	console.log("AEA2",videoReference)
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
    } else{
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

  getPercentage(total_questions: number, answered_correctly: number){
    const result = Math.round((answered_correctly * 100)/total_questions)
    return result
  }


  

  async getStadistics(userId: string): Promise<BaseResponse>{
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

    const hit_percentaje_today = this.getPercentage(total_questions_today, answered_correctly_today)
    const hit_percentaje_week = this.getPercentage(total_questions_week, answered_correctly_week)

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
