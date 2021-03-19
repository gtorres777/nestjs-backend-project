import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {SetsSchema} from './models/sets.schema';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';

@Module({
  controllers: [SetsController],
  providers: [SetsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Sets',
        schema: SetsSchema
      }
    ])
  ],
  exports: [SetsService]
})
export class SetsModule {}
