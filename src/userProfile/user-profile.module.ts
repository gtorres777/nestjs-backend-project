import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileUserSchema, VideoReferenceSchema } from './models/user-profile.schema';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { VideosModule } from 'src/videos/videos.module';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService],
  imports: [
    VideosModule,
    MongooseModule.forFeature([
      {
        name: 'ProfileUser',
        schema: ProfileUserSchema,
      },
      {
        name: 'VideoReference',
        schema: VideoReferenceSchema,
      }
    ]),
  ],
  exports: [UserProfileService]
})
export class UserProfileModule {}
