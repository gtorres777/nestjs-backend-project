import { Module } from '@nestjs/common';
import { OutfitController } from './outfit.controller';

@Module({
  controllers: [OutfitController]
})
export class OutfitModule {}
