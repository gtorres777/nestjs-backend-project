import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ItemSchema } from './item.schema';
import { UserModule } from './user/user.module';
import { TalesModule } from './tales/tales.module';
import { AuthModule } from './auth/auth.module';


// const options : MongooseModuleOptions = {

// }

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo/nestjs', {useFindAndModify: false}),
    MongooseModule.forFeature([
      {
        name: 'Item',
        schema: ItemSchema
      }
    ]),
    UserModule,
    TalesModule,
    // AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

