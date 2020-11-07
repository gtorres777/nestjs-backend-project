import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileUserDto } from './dtos/user-profile.dto';
import { ProfileUser } from './interface/user-profile.interface';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel('ProfileUser') private profileUserModel: Model<ProfileUser>,
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
}
