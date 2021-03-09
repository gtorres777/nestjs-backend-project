import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';

@Module({
  controllers: [SetsController]
})
export class SetsModule {}
