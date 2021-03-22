import { Module } from '@nestjs/common';
import { TalesController } from './tales.controller';
import { TalesService } from './tales.service';
import { MongooseModule } from '@nestjs/mongoose';
import {TalesSchema} from './models/tales.schema';
import {UserProfileModule} from 'src/userProfile/user-profile.module';
import {TalesCompletedSchema} from 'src/userProfile/models/user-profile.schema';
import {WalletModule} from 'src/wallet/wallet.module';


@Module({
  controllers: [TalesController],
  providers: [TalesService],
  imports:[
    UserProfileModule,
    WalletModule,
    MongooseModule.forFeature([
      {
        name:'Tales',
        schema: TalesSchema,
      },
      {
        name:'TalesCompleted',
        schema: TalesCompletedSchema,
      },
    ]),
  ],
  exports: [MongooseModule]
})
export class TalesModule {}
