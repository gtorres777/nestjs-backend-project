import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {OutfitSchema} from './models/outfit.schema';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';

@Module({
  controllers: [OutfitController],
  providers: [OutfitService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Outfit',
        schema: OutfitSchema
      }
    ])
  ],
  exports: [OutfitService, MongooseModule]
})
export class OutfitModule {}
