import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvatarService } from 'src/avatar/avatar.service';
import {CreateProfileUserDto} from 'src/userProfile/dtos/user-profile.dto';
import {SuscriptionState} from 'src/userProfile/interface/user-profile.interface';
import {UserProfileService} from 'src/userProfile/user-profile.service';
import {CreateWalletDto} from 'src/wallet/dtos/wallet.dto';
import {WalletService} from 'src/wallet/wallet.service';
import { CreateUserDto } from './dtos/user.dto';
import { User } from './interface/user.interface';


@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private userProfileService: UserProfileService,
    private walletService: WalletService,
    private avatarService: AvatarService
  ) {}

  async addUser(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    const user_saved = await createdUser.save(); 
    
    console.log("RESPONSE",user_saved._id)

    const imagen: string = 'https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293__340.jpg';

    const userprofile_data: CreateProfileUserDto = { 
      id:null, 
      name: user_saved.name, 
      profile_image:imagen, 
      favorite_tales:[  ], 
      tales_completed:[  ],
      _user: user_saved._id,
      suscription_state:SuscriptionState.INACTIVE
    };

    const profileUser= await this.userProfileService.addProfile(userprofile_data, user_saved._id)

    const userWallet_data: CreateWalletDto = {
      _user: user_saved._id,
      total_coins: 0
    }
    const userWallet = await this.walletService.addWallet(userWallet_data, user_saved._id)
    this.avatarService.createAvatar(user_saved._id).subscribe(console.log)


    return user_saved
  }

  async findOne(user: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: user });
  }

}
