import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileUserDto, CreateUserDto } from './dtos/user.dto';
import { ProfileUser, User } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('ProfileUser') private profileUserModel: Model<ProfileUser>,
  ) {}

  async addUser(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findOne(user: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: user });
  }

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
