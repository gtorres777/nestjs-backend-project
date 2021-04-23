import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutfitModule } from 'src/outfit/outfit.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import {AvatarSchema} from './models/avatar.schema';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [
    WalletModule,
	OutfitModule,
    MongooseModule.forFeature([
      {
        name: 'Avatar',
        schema: AvatarSchema,
      }
    ])
  ],
  exports: [AvatarService, MongooseModule]
})
export class AvatarModule {}
