// Project libraries
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Project files
import { AvatarModule } from 'src/avatar/avatar.module';
import {UserProfileModule} from 'src/userProfile/user-profile.module';
import {WalletModule} from 'src/wallet/wallet.module';
import { UserSchema } from './models/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    UserProfileModule,
    WalletModule,
    AvatarModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
  ],
  exports: [UserService, MongooseModule]
})
export class UserModule {}
