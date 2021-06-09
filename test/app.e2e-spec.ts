import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AvatarModule } from 'src/avatar/avatar.module';
import { UserModule } from 'src/user/user.module';
import { rootMongooseTestModule, closeInMongodConnection } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;

   beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Outfit', schema: OutfitSchema },
        ])
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/outfit')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close()
  });

});
