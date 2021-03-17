import {
  Controller,
  Body,
  Post,
  Put,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards
} from '@nestjs/common';
import { CreateTalesDto } from './dto/tales.dto';
import { TalesService } from './tales.service';
import { BasePagination, Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTalesCompletedDto, CreateVideoReference } from 'src/userProfile/dtos/user-profile.dto';

@Controller('tales')
export class TalesController {
  constructor(
    private readonly talesService: TalesService) { }

  // @Get()
  // getAllTales(): Promise<Tales[]> {
  //   return this.talesService.getAll()
  // }

  @Get('tales_completed/:page')
  @UseGuards(JwtAuthGuard)
  getTalesCompleted(@Req() req, @Param("page") param: string): Promise<BasePagination<Tales[]>> {
    return this.talesService.getTalesCompleted(req.user.userId, Number(param))
  }

  @Get('favorite_tales')
  @UseGuards(JwtAuthGuard)
  getFavoriteTales(@Req() req): Promise<string[]> {
    return this.talesService.getFavoriteTales(req.user.userId)
  }

  @Get(':id')
  async getOneTale(@Param('id') id: string): Promise<Tales> {
    const tale = await this.talesService.getOneTale(id);
    if (!tale) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'El recurso no existe',
      }, HttpStatus.NOT_FOUND);
    }
    return tale;
  }

  // @Get('questions/:tale_id')
  // async getQuestions(@Param('tale_id') tale_id: string): Promise<Tales> {
  //   const tale = await this.talesService.getQuestions(tale_id);
  //   if (!tale) {
  //     throw new HttpException({
  //       status: HttpStatus.NOT_FOUND,
  //       error: 'El cuento fue encontrado',
  //     }, HttpStatus.NOT_FOUND);
  //   }
  //   return tale;
  // } 

  @Post()
  addTales(@Body() data: CreateTalesDto): Promise<Tales> {
    console.log(data);
    return this.talesService.addTales(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add_favorite_tale')
  async addFavoriteTale(
    @Body('tale_id') tale_id: string,
    @Req() req) {
    return await this.talesService.addFavoriteTale(tale_id, req.user.userId)
  }


  @UseGuards(JwtAuthGuard)
  @Post('add_tale_completed')
  async addTaleCompleted(
    @Body() data: CreateTalesCompletedDto,
    @Req() req) {
    console.log("data", data)
    return {
      message: "Se agrego correctamente el cuento a tus cuentos completados",
      aea: await this.talesService.addTaleCompleted(data, req.user.userId)
    }
  }


  @Put(':id')
  updateTales(
    @Param('id') id: string,
    @Body() data: UpdateTalesDto,
  ): Promise<Tales> {
    return this.talesService.updateTales(data, id);
  }


  @UseGuards(JwtAuthGuard)
  @Post('test/:id')
  async test(@Req() req, @Param("id") id: string) {

    return {
      message: "ww",
      aea: await this.talesService.updateVideTime(id, req.user.userId)
    }
  }
}

