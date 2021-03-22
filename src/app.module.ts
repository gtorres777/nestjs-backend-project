import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TalesModule } from './tales/tales.module';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './userProfile/user-profile.module';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AvatarModule } from './avatar/avatar.module';
import { SetsModule } from './sets/sets.module';
import AdminBro from 'admin-bro';
import { OutfitModule } from './outfit/outfit.module';
import { VideosModule } from './videos/videos.module';
import { AdminModule } from '@admin-bro/nestjs';
import * as AdminBroMongoose from '@admin-bro/mongoose';
import { Model } from 'mongoose';
import { User } from './user/interface/user.interface';
import { Tales } from './tales/interface/tales.interface';
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
      imports: [UserModule, TalesModule],
      inject:[getModelToken("User"), getModelToken("Tales")],
      useFactory: (adminModel: Model<User>, talesModel: Model<Tales>) => ({
        adminBroOptions: {
          rootPath: "/admin",
          resources: [
            {resource: adminModel},
            {resource: talesModel }
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
