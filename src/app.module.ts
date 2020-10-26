import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ItemSchema } from './item.schema';
import { UserModule } from './user/user.module';


// const options : MongooseModuleOptions = {

// }

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo/nestjs'),
    MongooseModule.forFeature([
      {
        name: 'Item',
        schema: ItemSchema
      }
    ]),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

