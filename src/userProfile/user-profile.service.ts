import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideosService } from 'src/videos/videos.service';
import { CreateProfileUserDto } from './dtos/user-profile.dto';
import { ProfileUser, VideoReference, SuscriptionState } from './interface/user-profile.interface';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel('ProfileUser') private profileUserModel: Model<ProfileUser>,
    @InjectModel('VideoReference') private videoReferenceModel: Model<VideoReference>,
    private videoService: VideosService
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
      state: SuscriptionState.ACTIVE
    })
    // currentProfile.user_videos.push(videoReference)
    return await videoReference.save()
  }

  async getAllVideos(id: string): Promise<VideoReference[]> {
    const currentDate:Date = new Date()
    const TO_HOURS = 1000 * 60 * 60
    const profile = await this.profileUserModel.findOne({ _user: id });
    profile.user_videos.map((item) => {
      const aea = Math.round((currentDate.valueOf() - item.date.valueOf())/TO_HOURS)
      console.log("ww", aea)
      if (aea >= 24) {
        item.state = SuscriptionState.INACTIVE
      }
    })
    const profileUpdated = await profile.save()
    return profileUpdated.user_videos
  }

}
