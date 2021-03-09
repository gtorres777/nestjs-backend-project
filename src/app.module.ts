import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TalesModule } from './tales/tales.module';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './userProfile/user-profile.module';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { AvatarModule } from './avatar/avatar.module';
import { SetsModule } from './sets/sets.module';
import { OutfitModule } from './outfit/outfit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot('mongodb://mongo/nestjs', {
      useFindAndModify: false,
    }),
    UserModule,
    TalesModule,
    UserProfileModule,
    AuthModule,
    WalletModule,
    AvatarModule,
    SetsModule,
    OutfitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
