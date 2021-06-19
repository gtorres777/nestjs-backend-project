import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { rootMongooseTestModule, closeInMongodConnection } from 'src/helpers/test-utils/mongo/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { OutfitSchema } from 'src/outfit/models/outfit.schema';
import { OutfitModule } from 'src/outfit/outfit.module';
import { new_outfit4, new_video3, new_tale, new_tale_for_update, new_user, new_avatar } from 'src/helpers/test-utils/fake-data/fake-data';
import { AvatarSchema } from 'src/avatar/models/avatar.schema';
import { WalletSchema } from 'src/wallet/models/wallet.schema';
import { UserSchema } from 'src/user/models/user.schema';
import { ProfileUserSchema, VideoReferenceSchema, TalesCompletedSchema } from 'src/userProfile/models/user-profile.schema';
import { VideoSchema } from 'src/videos/model/video.schema';
import { TalesSchema } from 'src/tales/models/tales.schema';
import { VideosModule } from 'src/videos/videos.module';
import { TalesModule } from 'src/tales/tales.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services';
import { WalletModule } from 'src/wallet/wallet.module';
import { AvatarModule } from 'src/avatar/avatar.module';
import { CreateTalesCompletedDto } from 'src/userProfile/dtos/user-profile.dto';
import { buyTimeForVideo } from 'src/userProfile/interface/uservideos.interface';
import { BuyAvatarSetDto } from 'src/avatar/dtos/avatar.dto';
import { ListOfSet } from 'src/avatar/interface/avatar.interface';

describe('EndToEndTesting (e2e)', () => {

  let app: INestApplication;

  ////////////////////////////////////

  let outfit_create_response

  let tale_create_response

  let tale_create_response_updated

  let access_token_after_registration

  let access_token_after_login

  let video_obtained
  ////////////////////////

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
        OutfitModule,
        VideosModule,
        TalesModule,
        UserModule,
        AuthModule,
        WalletModule,
        AvatarModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Avatar', schema: AvatarSchema },
          { name: 'Outfit', schema: OutfitSchema },
          { name: 'Wallet', schema: WalletSchema },
          { name: 'User', schema: UserSchema },
          { name: 'ProfileUser', schema: ProfileUserSchema },
          { name: 'VideoReference', schema: VideoReferenceSchema },
          { name: 'Videos', schema: VideoSchema },
          { name: 'Tales', schema: TalesSchema },
          { name: 'TalesCompleted', schema: TalesCompletedSchema },
        ]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              secret: configService.get<string>('JWT_SECRET_KEY'),
              signOptions: { expiresIn: '9999999M' }
            }
          },
          inject: [ConfigService]
        }),
      ],
      providers:[
        AuthService
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }))
    await app.init();
  });

  describe('# OutfitController', () => {

    it('/outfit (POST) should create an outfit', async () => {

      outfit_create_response = await request(app.getHttpServer())
        .post('/outfit')
        .send(new_outfit4)
        .expect(201)

      expect(outfit_create_response).not.toBeNull()
      expect(outfit_create_response.body._id).not.toBeNull()
      expect(outfit_create_response.body.outfit_image).toBe(new_outfit4.outfit_image)
      expect(outfit_create_response.body.outfit_name).toBe(new_outfit4.outfit_name)
      expect(outfit_create_response.body.price).toBe(new_outfit4.price)

    });

    it('/outfit (POST) should not create an outfit with the same value of an existing outfit', async () => {

      try {

        await request(app.getHttpServer())
          .post('/outfit')
          .send(new_outfit4)
          .expect(400)

      } catch (error) {

        expect(error).not.toBeNull()
        expect(error.response).toEqual('No se puede agregar un mismo tipo de outfit que tenga el mismo nombre que uno existente')
        expect(error.status).toEqual(400)

      }

    });

    it('/outfit (GET) should retrieve all outfits available', async () => {

      const response = await request(app.getHttpServer())
        .get('/outfit')
        .expect(200)

      expect(response.body.toString()).toContain([ outfit_create_response.body ])

    });

  })

  describe('# VideosController', () => {

    it('/videos (POST) should create a video', async () => {

      const response = await request(app.getHttpServer())
        .post('/videos')
        .send(new_video3)

      expect(response).not.toBeNull()
      expect(response.body._id).not.toBeNull()
      expect(response.body.title).toBe(new_video3.title)
      expect(response.body.path).toBe(new_video3.path)
      expect(response.body.img).toBe(new_video3.img)

    });

    it('/videos (POST) should not create a video with the same value of an existing video', async () => {

      try {

        await request(app.getHttpServer())
          .post('/videos')
          .send(new_video3)
          .expect(400)

      } catch (error) {

        expect(error).not.toBeNull()
        expect(error.response).toEqual('No se puede agregar un mismo video que tenga el mismo url que uno existente')
        expect(error.status).toEqual(400)

      }

    });

  })


  describe('# TalesController', () => {

    it('/tales (POST) should create a tale', async () => {

      tale_create_response = await request(app.getHttpServer())
        .post('/tales')
        .send(new_tale)
        .expect(201)

      expect(tale_create_response).not.toBeNull()
      expect(tale_create_response.body._id).not.toBeNull()
      expect(tale_create_response.body.title).toBe(new_tale.title)
      expect(tale_create_response.body.author).toBe(new_tale.author)
      expect(tale_create_response.body.content.toString()).toContain(new_tale.content)
      expect(tale_create_response.body.cover_page).toBe(new_tale.cover_page)
      expect(tale_create_response.body.difficulty).toBe(new_tale.difficulty)
      expect(tale_create_response.body.gender).toBe(new_tale.gender)
      expect(tale_create_response.body.questions.toString()).toContain(new_tale.questions)

    });

    // TODO falta poder validar mediante e2e test cuando se envia un mismo nombre cuento o cover page
      // porque no se puede obtener los valores de keyValue y keyPattern cuando se trata de hacer la peticion
      // desde aqui, pero si funciona normal el MongoExceptionFilter cuando se realizo la peticion en postman

    it('/tales (POST) should not create a tale if sending null body values', async () => {

      try {

        return await request(app.getHttpServer())
          .post('/tales')
          .send("")
          .expect(400)

      } catch (error) {

        expect(error).not.toBeNull()
        expect(error.response.error).toEqual('Bad Request')
        expect(error.response.message[0]).toEqual('title must be a string')
        expect(error.response.message[1]).toEqual('cover_page must be a string')
        expect(error.response.message[2]).toEqual('each value in content must be a string')
        expect(error.response.message[3]).toEqual('content must be an array')
        expect(error.response.message[4]).toEqual('difficulty must be a string')
        expect(error.response.message[5]).toEqual('gender must be a string')
        expect(error.response.message[6]).toEqual('author must be a string')
        expect(error.response.message[7]).toEqual('questions should not be empty')
        expect(error.response.message[8]).toEqual('questions must be an array')
        expect(error.status).toEqual(400)

      }

    });

    it('/tales/tale/:id (GET) should retrieve a tale', async () => {

      const tale_id = tale_create_response.body._id

      const response = await request(app.getHttpServer())
        .get('/tales/tale/'+tale_id)

      expect(response).not.toBeNull()
      expect(response.body._id).toBe(tale_id)
      expect(response.body.title).toBe(tale_create_response.body.title)
      expect(response.body.content.toString()).toContain(tale_create_response.body.content)

    });

    it('/tales/update/:id (PUT) should update a tale', async () => {

      const tale_id = tale_create_response.body._id

      tale_create_response_updated = await request(app.getHttpServer())
        .put('/tales/update/'+tale_id)
        .send(new_tale_for_update)
        .expect(200)

      expect(tale_create_response_updated).not.toBeNull()
      expect(tale_create_response_updated.body._id).not.toBeNull()
      expect(tale_create_response_updated.body.title).toBe(new_tale_for_update.title)
      expect(tale_create_response_updated.body.author).toBe(new_tale_for_update.author)
      expect(tale_create_response_updated.body.content.toString()).toContain(new_tale_for_update.content)
      expect(tale_create_response_updated.body.cover_page).toBe(new_tale_for_update.cover_page)
      expect(tale_create_response_updated.body.difficulty).toBe(new_tale_for_update.difficulty)
      expect(tale_create_response_updated.body.gender).toBe(new_tale_for_update.gender)
      expect(tale_create_response_updated.body.questions.toString()).toContain(new_tale_for_update.questions)

    });

  })

  describe('# UserController', () => {

    it('/user (POST) should create a user', async () => {

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(new_user)

      access_token_after_registration = response.body.access_token

      expect(response).not.toBeNull()
      expect(Object.keys(response.body).length).toBe(3)
      expect(response.body.name).toBe(new_user.name)
      expect(response.body.email).toBe(new_user.email)
      expect(access_token_after_registration).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex

    });

    it('/user (POST) should not create a user with null body values sent', async () => {

        const response = await request(app.getHttpServer())
          .post('/user')

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message[0]).toEqual('name must be a string')
        expect(response.body.response.message[1]).toEqual('email must be an email')
        expect(response.body.response.message[2]).toEqual('password must be a string')
        expect(response.status).toEqual(400)

    });

  })

  describe('# AuthController', () => {

    it('/auth/login (POST) should not authenticate a user', async () => {

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .expect(401)

      expect(response.body.statusCode).toBe(401)
      expect(response.body.message).toBe('Unauthorized')


    });

    it('/auth/login (POST) should authenticate a user', async () => {

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: new_user.email,
          password: new_user.password
        })

      access_token_after_login = response.body.data.user.access_token

      expect(response).not.toBeNull()
      expect(Object.keys(response.body).length).toBe(4)
      //Message object
      expect(response.body.message).toEqual('Login exitoso')
      //Avatar object
      expect(response.body.avatar.avatar_sets).toEqual(new_avatar.avatar_sets)
      expect(response.body.avatar.current_style).toEqual(new_avatar.current_style)
      //Wallet object
      expect(response.body.wallet.total_coins).toEqual(0)
      //Data of user object
      expect(response.body.data.user.name).toEqual(new_user.name)
      expect(response.body.data.user.email).toEqual(new_user.email)
      expect(access_token_after_login).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex

    });

  })

  describe('# TalesController', () => {

    it('/tales/tales_completed/1 (GET) should not retrieve list of tales if a user is not authenticated', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/1')
        .expect(400)

      expect(response.body.status).toBe(401)
      expect(response.body.message).toBe('Unauthorized')

    });

    it('/tales/tales_completed/1 (GET) should retrieve list of tales for a user after registration', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/1')
        .set('Authorization', `Bearer ${access_token_after_registration}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toContain(tale_create_response.body)
      expect(response.body.data[0].times_read).toBeFalsy()
      expect(response.body.data[0].added_as_favorite).toBeFalsy()
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });

    it('/tales/tales_completed/1 (GET) should retrieve list of tales for a user after login', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/1')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toContain(tale_create_response.body)
      expect(response.body.data[0].times_read).toBeFalsy()
      expect(response.body.data[0].added_as_favorite).toBeFalsy()
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });

    it('/tales/tales_completed/2 (GET) should retrieve an empty data list of tales for a user after registration', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/2')
        .set('Authorization', `Bearer ${access_token_after_registration}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toBe('')
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });

    it('/tales/tales_completed/2 (GET) should retrieve an empty data list of tales for a user after login', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/2')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toBe('')
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });

    //// TALES COMPLETED

    /// Add completed tale
    it('/tales/add_tale_completed (POST) should not add a tale as completed with null body values sent', async () => {

        const response = await request(app.getHttpServer())
        .post('/tales/add_tale_completed')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send()
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message[0]).toEqual('tale_id must be a string')
        expect(response.body.response.message[1]).toEqual('answered_correctly must be a string')
        expect(response.body.response.message[2]).toEqual('answered_incorrectly must be a string')
        expect(response.status).toEqual(400)

    });

    it('/tales/add_tale_completed (POST) should not add a tale as completed if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .post('/tales/add_tale_completed')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/tales/add_tale_completed (POST) should add a tale as completed', async () => {

      const tale_as_completed: CreateTalesCompletedDto = {
        tale_id: tale_create_response_updated.body._id,
        answered_correctly: '2',
        answered_incorrectly: '3'
      }

      const response = await request(app.getHttpServer())
        .post('/tales/add_tale_completed')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(tale_as_completed)
        .expect(201)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.message).toBe('Cuento terminado agregado correctamente')
      expect(response.body.tale_title).toBe(tale_create_response_updated.body.title)
      expect(response.body.obtained_video).not.toBeNull()
      expect(response.body.user_wallet).not.toBeNull()

    });

    it('/tales/add_tale_completed (POST) should not add a tale as completed because already added as completed', async () => {

      const tale_as_completed: CreateTalesCompletedDto = {
        tale_id: tale_create_response_updated.body._id,
        answered_correctly: '2',
        answered_incorrectly: '3'
      }

      const response = await request(app.getHttpServer())
        .post('/tales/add_tale_completed')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(tale_as_completed)
        .expect(201)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.message).toBe('Cuento terminado anteriormente')
      expect(response.body.tale_title).toBe(tale_create_response_updated.body.title)
      expect(response.body.obtained_video).not.toBeNull()
      expect(response.body.user_wallet).not.toBeNull()

    });

    it('/tales/tales_completed/1 (GET) should retrieve list of tales and the tale added as completed', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/1')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toContain(tale_create_response_updated.body)
      expect(response.body.data[0].times_read).toBeTruthy()
      expect(response.body.data[0].added_as_favorite).toBeFalsy()
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });

    //// TALES FAVORITE

    /// Add favorite tale
    it('/tales/add_favorite_tale (POST) should not add a tale as favorite with null body values sent', async () => {

        const response = await request(app.getHttpServer())
        .post('/tales/add_favorite_tale')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send()
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message).toEqual('Missing ID from tale')
        expect(response.status).toEqual(400)

    });

    it('/tales/add_favorite_tale (POST) should not add a tale as favorite if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .post('/tales/add_favorite_tale')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/tales/add_favorite_tale (POST) should add a tale as favorite', async () => {

      const response = await request(app.getHttpServer())
        .post('/tales/add_favorite_tale')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(
          {
            tale_id: tale_create_response_updated.body._id,
          }
        )
        .expect(201)

      expect(Object.keys(response.body).length).toBe(2)
      expect(response.body.status).toBe(202)
      expect(response.body.message).toBe('Cuento favorito agregado correctamente')

    });

    it('/tales/add_favorite_tale (POST) should not add a tale as favorite because already added as favorite', async () => {

      const response = await request(app.getHttpServer())
        .post('/tales/add_favorite_tale')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(
          {
            tale_id: tale_create_response_updated.body._id,
          }
        )
        .expect(201)

      expect(Object.keys(response.body).length).toBe(2)
      expect(response.body.status).toBe(202)
      expect(response.body.message).toBe('Ya tiene agregado este cuento a sus favoritos')

    });


    /// Get favorite tales of a user

    it('/tales/favorite_tales (GET) should not retrieve favorite tales of a user', async () => {

        const response = await request(app.getHttpServer())
        .get('/tales/favorite_tales')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/tales/favorite_tales (GET) should retrieve favorite tales of a user', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/favorite_tales')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(response.body.toString()).toContain(tale_create_response_updated.body)

    });

    it('/tales/tales_completed/1 (GET) should retrieve list of tales and the tale added as favorite', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/1')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toContain(tale_create_response_updated.body)
      expect(response.body.data[0].times_read).toBeTruthy()
      expect(response.body.data[0].added_as_favorite).toBeTruthy()
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });


    /// Remove favorite tale
    it('/tales/remove_favorite_tale (DELETE) should not remove a tale from favorites with null body values sent', async () => {

        const response = await request(app.getHttpServer())
        .delete('/tales/remove_favorite_tale')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send()
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message).toEqual('Missing ID from tale')
        expect(response.status).toEqual(400)

    });

    it('/tales/remove_favorite_tale (DELETE) should not remove a tale from favorites if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .delete('/tales/remove_favorite_tale')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/tales/remove_favorite_tale (DELETE) should remove a tale from favorites', async () => {

      const response = await request(app.getHttpServer())
        .delete('/tales/remove_favorite_tale')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(
          {
            tale_id: tale_create_response_updated.body._id,
          }
        )
        .expect(200)

      expect(Object.keys(response.body).length).toBe(2)
      expect(response.body.status).toBe(204)
      expect(response.body.message).toBe('Cuento favorito removido correctamente')

    });

    it('/tales/remove_favorite_tale (DELETE) should not remove a tale from favorites because not exists on favorites or already removed from favorites', async () => {

      const response = await request(app.getHttpServer())
        .delete('/tales/remove_favorite_tale')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(
          {
            tale_id: tale_create_response_updated.body._id,
          }
        )
        .expect(200)

      expect(Object.keys(response.body).length).toBe(2)
      expect(response.body.status).toBe(205)
      expect(response.body.message).toBe('Id de cuento no encontrado')

    });

    it('/tales/tales_completed/1 (GET) should retrieve list of tales and the tale removed from favorites', async () => {

      const response = await request(app.getHttpServer())
        .get('/tales/tales_completed/1')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(Object.keys(response.body).length).toBe(4)
      expect(response.body.data.toString()).toContain(tale_create_response_updated.body)
      expect(response.body.data[0].times_read).toBeTruthy()
      expect(response.body.data[0].added_as_favorite).toBeFalsy()
      expect(response.body.currentPage).toBe(1)
      expect(response.body.lastPage).toBe(1)
      expect(response.body.perPage).toBe(4)

    });

  })

  describe('# UserProfileController', () => {

    /// Get all videos from a user
    it('/profile/videos (GET) should not retrieve all videos obtained from a user if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .get('/profile/videos')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/profile/videos (GET) should retrieve all videos obtained from a user', async () => {

      const response = await request(app.getHttpServer())
        .get('/profile/videos')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(response.body).not.toBeNull()
      expect(response.body.length).toBe(1)

      video_obtained = response.body[0]._videoId
    });


    /// Buy more time for a video

    it('/profile/updateVideo (POST) should not update time for a video buyed from a user with null body values sent', async () => {

        const response = await request(app.getHttpServer())
        .post('/profile/updateVideo')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send()
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message).toEqual('Missing ID from video')
        expect(response.status).toEqual(400)

    });

    it('/profile/updateVideo (POST) should not update time for a video buyed from a user if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .post('/profile/updateVideo')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/profile/updateVideo (POST) should update time for a video buyed from a user', async () => {

        let buy_video: buyTimeForVideo = {
          videoId: video_obtained,
          coins:1
        }

        const response = await request(app.getHttpServer())
        .post('/profile/updateVideo')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(buy_video)

        expect(response).not.toBeNull()
        expect(response.body.message).toEqual('Video actualizado y Monedas restadas correctamente')
        expect(response.body.data.length).toBe(1)

    });

    /// Get Stadistics from a user
    it('/profile/stadistics (GET) should not retrieve stadistics from a user if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .get('/profile/stadistics')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/profile/stadistics (GET) should retrieve stadistics from a user', async () => {

      const response = await request(app.getHttpServer())
        .get('/profile/stadistics')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(response.body).not.toBeNull()
      expect(response.body.message).toEqual('Datos obtenidos correctamente')
      expect(Object.keys(response.body.stadistics).length).toBe(3)
      expect(Object.keys(response.body.stadistics.today).length).toBe(2)
      expect(Object.keys(response.body.stadistics.week).length).toBe(2)

    });

  })


  describe('# OutfitController', () => {

    /// Get all outfits available

    it('/outfit (GET) should retrieve all outfits available', async () => {

      const response = await request(app.getHttpServer())
        .get('/outfit')
        .expect(200)

      expect(response.body).not.toBeNull()
      expect(response.body.length).toBe(1)
      expect(response.body.toString()).toContain(outfit_create_response.body)

    });

  })

  describe('# AvatarController', () => {

    /// Get all avatars available for a user

    it('/avatar/user_avatar (GET) should not retrieve avatars from a user if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .get('/avatar/user_avatar')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });


    it('/avatar/user_avatar (GET) should retrieve all avatars available from a user', async () => {

      const response = await request(app.getHttpServer())
        .get('/avatar/user_avatar')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .expect(200)

      expect(response.body).not.toBeNull()
      expect(response.body.avatar_sets).toEqual(new_avatar.avatar_sets)
      expect(response.body.current_style).toEqual(new_avatar.current_style)

    });


    /// Buy outfit for an avatar from a user

    it('/avatar/buy_outfit (POST) should not buy outfit for a user with null body values sent', async () => {

        const response = await request(app.getHttpServer())
        .post('/avatar/buy_outfit')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send()
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message[0]).toEqual('set_name must be a valid enum value')
        expect(response.body.response.message[1]).toEqual('outfitId must be a string')
        expect(response.status).toEqual(400)

    });

    it('/avatar/buy_outfit (POST) should not buy outfit for a user if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .post('/avatar/buy_outfit')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/avatar/buy_outfit (POST) should buy outfit for a user', async () => {

        let buy_avatar: BuyAvatarSetDto = {
          set_name: ListOfSet.ASTRONAUT,
          outfitId: outfit_create_response.body._id
        }

        const response = await request(app.getHttpServer())
        .post('/avatar/buy_outfit')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send(buy_avatar)

      expect(response).not.toBeNull()
      expect(Object.keys(response.body).length).toBe(2)
      expect(response.body.avatar.avatar_sets).toContain(buy_avatar.set_name)
      expect(response.body.avatar.current_style).toEqual(buy_avatar.set_name)
      expect(response.body.wallet).not.toBeNull()

    });


    /// Equip an available outfit for an avatar from a user

    it('/avatar/equip_outfit (POST) should not equip outfit for a user with null body values sent', async () => {

        const response = await request(app.getHttpServer())
        .patch('/avatar/equip_outfit')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send()
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.error).toEqual('Bad Request')
        expect(response.body.response.message).toEqual('Missing ID from outfit')
        expect(response.status).toEqual(400)

    });

    it('/avatar/equip_outfit (POST) should not equip outfit for a user if not authenticated user', async () => {

        const response = await request(app.getHttpServer())
        .patch('/avatar/equip_outfit')
        .expect(400)

        expect(response).not.toBeNull()
        expect(response.body.response.statusCode).toEqual(401)
        expect(response.body.response.message).toEqual('Unauthorized')
        expect(response.body.status).toEqual(401)

    });

    it('/avatar/equip_outfit (POST) should equip outfit for a user', async () => {

        const response = await request(app.getHttpServer())
        .patch('/avatar/equip_outfit')
        .set('Authorization', `Bearer ${access_token_after_login}`)
        .send({
          outfitId: outfit_create_response.body._id
        })

      expect(response).not.toBeNull()
      expect(response.body.avatar_sets).toContain(outfit_create_response.body.outfit_name)
      expect(response.body.current_style).toEqual(outfit_create_response.body.outfit_name)

    });
  })

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close()
  });

});
