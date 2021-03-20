import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { Avatar, ListOfSet } from './interface/avatar.interface';

@Injectable()
export class AvatarService {

    constructor(
        @InjectModel("Avatar") private avatarModel: Model<Avatar>
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
    
    

}
