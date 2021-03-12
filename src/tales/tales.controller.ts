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
import { Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth.guard';
import {UserProfileService} from 'src/userProfile/user-profile.service';

@Controller('tales')
export class TalesController {
  constructor(
    private readonly talesService: TalesService,
    private readonly userProfileService: UserProfileService) {}

  // @Get()
  // getAllTales(): Promise<Tales[]> {
  //   return this.talesService.getAll()
  // }

  @Get('tales_completed')
  getTalesCompleted(): Promise<Tales[]>{
    return this.talesService.getTalesCompleted()
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
    @Req() req){
    await this.talesService.addFavoriteTale(tale_id,req.user.userId)
    return {
      message: "Se agrego correctamente el cuento a tus favoritos"
    }
  }

  @Put(':id')
  updateTales(
    @Param('id') id: string,
    @Body() data: UpdateTalesDto,
  ): Promise<Tales> {
    return this.talesService.updateTales(data, id);
  }
}
