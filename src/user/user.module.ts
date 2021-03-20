import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarModule } from 'src/avatar/avatar.module';
import {UserProfileModule} from 'src/userProfile/user-profile.module';
import {WalletModule} from 'src/wallet/wallet.module';
import { UserSchema } from './models/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    UserProfileModule,
    WalletModule,
    AvatarModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
  ],
  exports: [UserService]
})
export class UserModule {}
