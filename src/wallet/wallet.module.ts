// Project libraries
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Project files
import { WalletSchema } from './models/wallet.schema';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Wallet',
        schema: WalletSchema
      }
    ])
  ],
  exports: [WalletService, MongooseModule]
})
export class WalletModule {}
