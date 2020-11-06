import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileUserSchema, UserSchema } from './models/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ProfileUser',
        schema: ProfileUserSchema,
      },
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
    forwardRef(() => AuthModule)
    
  ],
  exports: [UserService]
})
export class UserModule {}
