import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { WalletService } from 'src/wallet/wallet.service';
import { Avatar, ListOfSet } from './interface/avatar.interface';

@Injectable()
export class AvatarService {

    constructor(
        @InjectModel("Avatar") private avatarModel: Model<Avatar>,
        private wallerService: WalletService
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

    async buySetAvatar(userId: string, setName: ListOfSet, coins: number): Promise<Avatar | null> {
        const checkCoins = await this.wallerService.checkCoins(userId, coins)
        if (checkCoins) {
            const userAvatar = await this.avatarModel.findOne({ _user: userId })
            userAvatar.avatar_sets.push(setName)
            userAvatar.current_style = setName
            await this.wallerService.substractCoinsToWallet(userId, coins)
            return await userAvatar.save()
        } else {
            return null
        }
    }
}
