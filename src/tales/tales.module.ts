import { Module } from '@nestjs/common';
import { TalesController } from './tales.controller';
import { TalesService } from './tales.service';
import { MongooseModule } from '@nestjs/mongoose';
import {TalesSchema} from './models/tales.schema';
import {UserProfileModule} from 'src/userProfile/user-profile.module';


@Module({
  controllers: [TalesController],
  providers: [TalesService],
  imports:[
    UserProfileModule,
    MongooseModule.forFeature([
      {
        name:'Tales',
        schema: TalesSchema,
      },
    ]),
  ],
})
export class TalesModule {}
