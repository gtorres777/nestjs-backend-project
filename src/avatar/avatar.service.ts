import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { OutfitService } from 'src/outfit/outfit.service';
import { WalletService } from 'src/wallet/wallet.service';
import { UpdateAvatarDto } from './dtos/update-avatar.dto';
import { Avatar, ListOfSet } from './interface/avatar.interface';

@Injectable()
export class AvatarService {

    constructor(
        @InjectModel("Avatar") private avatarModel: Model<Avatar>,
        private wallerService: WalletService,
		private outfitService: OutfitService,
    ) { }

    createAvatar(userId: string): Observable<Avatar> {
        const newAvatar = new this.avatarModel({
            _user: userId,
            avatar_sets: [ListOfSet.DEFAULT],
            current_style: ListOfSet.DEFAULT
        })
        const obs = from(newAvatar.save())
        return obs
    }

    async getAvatar(userId: string): Promise<Avatar> {
        const avatar = await this.avatarModel.findOne({ _user: userId })
        return avatar
    }

    async buySetAvatar(userId: string, setName: ListOfSet, outfitId:string): Promise<Avatar | null | number> {
        
        const avatar = await this.avatarModel.findOne({ _user: userId })
		const outfit = await this.outfitService.getOneOutfit(outfitId)
        const avatar_sets = avatar.avatar_sets.map(item => item)
        if (avatar_sets.includes(setName)){
          return 301
        }else{
          const checkCoins = await this.wallerService.checkCoins(userId, outfit.price)
          if (checkCoins) {
            const userAvatar = await this.avatarModel.findOne({ _user: userId })
            userAvatar.avatar_sets.push(setName)
            userAvatar.current_style = setName
            await this.wallerService.substractCoinsToWallet(userId, outfit.price)
            return await userAvatar.save()
        } else {
            return null
        }
        }
	}

  async updateAvatar(avatar: UpdateAvatarDto, id: string): Promise<Avatar> {
	return await this.avatarModel.findOneAndUpdate({ _id: id }, <Avatar>avatar, {
	  new: true,
	});
  }

  async equipOneAvatar(userId: string, outfitId: string) {
	  const outfit = await this.outfitService.getOneOutfit(outfitId)
	  const users_avatar = await this.getAvatar(userId)
	  
	  const update_avatar: UpdateAvatarDto = {
		  current_style: outfit.outfit_name
		}
	  
	  return await this.updateAvatar(update_avatar, users_avatar.id)
	}

	
}
