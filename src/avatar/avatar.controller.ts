// Project libraries
import { Body, UseFilters } from '@nestjs/common';
import { Controller, Get, Post, Patch, Req, UseGuards } from '@nestjs/common';

// Project libraries
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WalletService } from 'src/wallet/wallet.service';
import { AvatarService } from './avatar.service';
import { BuyAvatarSetDto } from './dtos/avatar.dto';
import { BadRequestFilter } from 'src/helpers/bad-request.filter';

@Controller('avatar')
@UseFilters(BadRequestFilter)
export class AvatarController {

    constructor(
        private service: AvatarService,
        private walletService: WalletService,
    ) {}

    @Post('buy_outfit')
    @UseGuards(JwtAuthGuard)
    async buyAvatarSet(@Req() req, @Body() body: BuyAvatarSetDto) {

        const response = await this.service.buySetAvatar(req.user.userId, body.set_name, body.outfitId)

        if(response != 301){

            if (response != null) {

                return { avatar:response , wallet: await this.walletService.getWallet(req.user.userId)}

            } else {

                return {
                    status: 404,
                    message: "No cuenta con las monedas suficientes"
                }
            }

        } else {

            return {
                status: 301,
                message: "El usuario ya cuenta con ese outfit"
            }
        }

    }

    @Patch('equip_outfit')
    @UseGuards(JwtAuthGuard)
    async equipOneAvatar(@Req() req, @Body('outfitId') outfitId: string){

        return await this.service.equipOneAvatar(req.user.userId, outfitId)

    }

    @Get('user_avatar')
    @UseGuards(JwtAuthGuard)
    async getUsersAvatar(@Req() req){

        return await this.service.getAvatar(req.user.userId)

	}
}
