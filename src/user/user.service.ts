import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/user.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private userModel: Model<User>
  ) { }

  async addUser(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user)
    return await createdUser.save()
  }
}
