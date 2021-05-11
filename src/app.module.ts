// Project libraries
import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import AdminBro from 'admin-bro';
import { AdminModule } from '@admin-bro/nestjs';
import * as AdminBroMongoose from '@admin-bro/mongoose';
import { Model } from 'mongoose';

// Project files
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/interface/user.interface';
import { Tales } from './tales/interface/tales.interface';
import { Avatar } from './avatar/interface/avatar.interface';
import { Outfit } from './outfit/interface/outfit.interface';
import { Videos } from './videos/interface/videos.interface';
import { Wallet } from './wallet/interface/wallet.interface';
import { ProfileUser } from './userProfile/interface/user-profile.interface';
import { UserModule } from './user/user.module';
import { TalesModule } from './tales/tales.module';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './userProfile/user-profile.module';
import { WalletModule } from './wallet/wallet.module';
import { AvatarModule } from './avatar/avatar.module';
import { SetsModule } from './sets/sets.module';
import { OutfitModule } from './outfit/outfit.module';
import { VideosModule } from './videos/videos.module';

AdminBro.registerAdapter(AdminBroMongoose);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot('mongodb://mongo/nestjs', {
      useFindAndModify: false,
    }),
    TalesModule,
    UserProfileModule,
    AuthModule,
    WalletModule,
    AvatarModule,
    SetsModule,
    OutfitModule,
    UserModule,
    VideosModule,
    AdminModule.createAdminAsync({
      imports: [
        UserModule,
        TalesModule,
        AvatarModule,
        OutfitModule,
        VideosModule,
        UserProfileModule,
        WalletModule
      ],
      inject:[
        getModelToken("User"),
        getModelToken("Tales"),
        getModelToken("Avatar"),
        getModelToken("Outfit"),
        getModelToken("Videos"),
        getModelToken("ProfileUser"),
        getModelToken("Wallet"),
      ],
      useFactory: (
        adminModel: Model<User>,
        talesModel: Model<Tales>,
        avatarModel: Model<Avatar>,
        outfitModel: Model<Outfit>,
        videosModel: Model<Videos>,
        userprofileModel: Model<ProfileUser>,
        walletModel: Model<Wallet>,
      ) => ({
        adminBroOptions: {
          rootPath: "/admin",
          resources: [
            {resource: adminModel},
            {resource: talesModel},
            {resource: avatarModel},
            {resource: outfitModel},
            {resource: videosModel},
            {resource: userprofileModel},
            {resource: walletModel},
          ]
        },
        auth: {
          authenticate: async (email, password) => Promise.resolve({email: "test"}),
          cookieName: "test",
          cookiePassword: "test"
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
