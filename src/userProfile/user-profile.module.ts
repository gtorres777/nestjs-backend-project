import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileUserSchema } from './models/user-profile.schema';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ProfileUser',
        schema: ProfileUserSchema,
      }
    ]),
  ],
  exports: [UserProfileService]
})
export class UserProfileModule {}
