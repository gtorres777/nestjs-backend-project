import { Body } from '@nestjs/common';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AvatarService } from './avatar.service';
import { BuyAvatarSetDto } from './dtos/avatar.dto';

@Controller('avatar')
export class AvatarController {

    constructor(private service: AvatarService) {}

    @Post('buy_outfit')
    @UseGuards(JwtAuthGuard)
    async buyAvatarSet(@Req() req, @Body() body: BuyAvatarSetDto) {
        const aea = await this.service.buySetAvatar(req.user.userId, body.set_name, body.coins)
        if(aea != 301){
          if (aea != null) {
            return aea
          } else {
            return {
                status: 404,
                message: "No cuenta con las monedas suficientes"
            }
          }
        }else{
          return {
            status: 301,
            message: "El usuario ya cuenta con ese outfit"
          }
        }
    }

	@Post('equip_outfit')
	@UseGuards(JwtAuthGuard)
	async equipOneAvatar(@Req() req, @Body('outfitId') outfitId: string){
		return await this.service.equipOneAvatar(req.user.userId, outfitId)
	}

}
