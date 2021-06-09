// Project libraries
import {
  Controller,
  Body,
  Post,
  Put,
  Delete,
  Param,
  Get,
  Req,
  UseGuards,
  UseFilters
} from '@nestjs/common';

// Project files
import { CreateTalesDto } from './dto/tales.dto';
import { TalesService } from './tales.service';
import { BasePagination, Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTalesCompletedDto, CreateVideoReference } from 'src/userProfile/dtos/user-profile.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { BadRequestFilter } from 'src/helpers/bad-request.filter';

@Controller('tales')
@UseFilters(BadRequestFilter)
export class TalesController {
  constructor(
    private readonly talesService: TalesService,
    private readonly walletService: WalletService,
  ) { }

  @Post()
  addTales(@Body() data: CreateTalesDto): Promise<Tales> {
    return this.talesService.addTales(data);
  }

  @Put('update/:id')
  updateTales(
    @Param('id') id: string,
    @Body() data: UpdateTalesDto,
  ): Promise<Tales> {
    return this.talesService.updateTales(data, id);
  }

  @Get('tale/:id')
  async getOneTale(@Param('id') id: string): Promise<Tales> {

    const tale = await this.talesService.getOneTale(id);

    return tale;
  }

  //// Favorite Tales

  @UseGuards(JwtAuthGuard)
  @Post('add_favorite_tale')
  async addFavoriteTale(
    @Body('tale_id') tale_id: string,
    @Req() req) {

    return await this.talesService.addFavoriteTale(tale_id, req.user.userId)

  }

  @Get('favorite_tales')
  @UseGuards(JwtAuthGuard)
  getFavoriteTales(@Req() req): Promise<string[]> {
    return this.talesService.getFavoriteTales(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove_favorite_tale')
  async removeFavoriteTale(
    @Body('tale_id') tale_id: string,
    @Req() req) {
    return await this.talesService.removeFavoriteTale(tale_id, req.user.userId)
  }

  ////////////////////////////

  ///// TALES COMPLETED

  @UseGuards(JwtAuthGuard)
  @Post('add_tale_completed')
  async addTaleCompleted(
    @Body() data: CreateTalesCompletedDto,
    @Req() req) {

    const base_response = await this.talesService.addTaleCompleted(data, req.user.userId)

    if (base_response.status === 201) {

      return {
        message: base_response.message,
        tale_title: base_response.tale_title,
        obtained_video: base_response.video_obtained,
        user_wallet: await this.walletService.getWallet(req.user.userId)
      }

    } else {

      return {
        message: base_response.message,
        tale_title: base_response.tale_title,
        obtained_video: base_response.video_obtained,
        user_wallet: await this.walletService.getWallet(req.user.userId)
      }
    }

  }

  @Get('tales_completed/:page')
  @UseGuards(JwtAuthGuard)
  getTalesCompleted(@Req() req, @Param("page") param: string): Promise<BasePagination<Tales[]>> {
    return this.talesService.getTalesCompleted(req.user.userId, Number(param))
  }

  //////////////////////////////
}
