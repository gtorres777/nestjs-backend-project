// Project libraries
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';

// Project files
import { OutfitService } from 'src/outfit/outfit.service';
import { WalletService } from 'src/wallet/wallet.service';
import { UpdateAvatarDto } from './dtos/update-avatar.dto';
import { Avatar, ListOfSet } from './interface/avatar.interface';

@Injectable()
export class AvatarService {

  constructor(
    @InjectModel("Avatar") private avatarModel: Model<Avatar>,
    private walletService: WalletService,
    private outfitService: OutfitService,
  ) { }

  createAvatar(userId: string): Observable<Avatar> {

    if (!userId) {

      throw new BadRequestException('Missing Id from user')

    } else {

      const newAvatar = new this.avatarModel({
        _user: userId,
        avatar_sets: [ListOfSet.DEFAULT],
        current_style: ListOfSet.DEFAULT
      })

      const obs = from(newAvatar.save())

      return obs

    }

  }

  async getAvatar(userId: string): Promise<Avatar> {

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else {

      const avatar = await this.avatarModel.findOne({ _user: userId })

      if (!avatar) {

        throw new NotFoundException('No avatar found for the given user')

      } else {

        return avatar

      }

    }

  }

  async buySetAvatar(userId: string, setName: ListOfSet, outfitId:string): Promise<Avatar | null | number> {

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else if (!setName) {

      throw new BadRequestException('Missing name of set')

    } else if (!outfitId) {

      throw new BadRequestException('Missing ID from outfit')

    } else {

      // Obtaining the avatar info for a given user
      const userAvatar = await this.avatarModel.findOne({ _user: userId })

      if (!userAvatar) {

        throw new NotFoundException('No avatar found for the given user')

      } else {

        // Obtaining the outfit info for a given outfitID
        const outfit = await this.outfitService.getOneOutfit(outfitId)


        // Obtaining the current avatars for validating later if the user already has that one
        const avatar_sets = userAvatar.avatar_sets.map(item => item)

        if (avatar_sets.includes(setName)){

          return 301

        } else {

          // Validating if the user has enough coins to buy the outfit
          const checkCoins = await this.walletService.checkCoins(userId, outfit.price)

          if (checkCoins) {

            userAvatar.avatar_sets.push(setName)

            userAvatar.current_style = setName

            await this.walletService.substractCoinsToWallet(userId, outfit.price)

            return await userAvatar.save()

          } else {

            return null

          }
        }




      }

    }

  }

  async updateAvatar(avatar: UpdateAvatarDto, id: string): Promise<Avatar> {

    if (!avatar){

      throw new BadRequestException('null body values')

    } else {

      return await this.avatarModel.findOneAndUpdate({ _id: id }, <Avatar>avatar, {
        new: true,
      });

    }

  }

  async equipOneAvatar(userId: string, outfitId: string) {

    if (!userId) {

      throw new BadRequestException('Missing ID from user')

    } else if (!outfitId){

      throw new BadRequestException('Missing ID from outfit')

    } else {

      const outfit = await this.outfitService.getOneOutfit(outfitId)

      const users_avatar = await this.getAvatar(userId)


      const update_avatar: UpdateAvatarDto = {
        current_style: outfit.outfit_name
      }

      return await this.updateAvatar(update_avatar, users_avatar.id)

    }

  }


}
