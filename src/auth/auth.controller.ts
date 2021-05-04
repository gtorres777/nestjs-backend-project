import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AvatarService } from 'src/avatar/avatar.service';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private avatarService: AvatarService,
    private walletService: WalletService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const data = await this.authService.login(req.user)
    if (data && data.access_token != "") {
      return {
        message: 'Login exitoso',
        avatar: await this.avatarService.getAvatar(data.user._id),
        wallet: await this.walletService.getWallet(data.user._id),
        data: {
          user:{
            name: data.user.name,
            email: data.user.email,
            access_token: data.access_token
          } 
        }
      }
    } 
  }
}
