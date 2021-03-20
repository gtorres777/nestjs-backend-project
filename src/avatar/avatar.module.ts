import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import {AvatarSchema} from './models/avatar.schema';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Avatar',
        schema: AvatarSchema,
      }
    ])
  ],
  exports: [AvatarService]
})
export class AvatarModule {}
