import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AvatarService } from 'src/avatar/avatar.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private avatarService: AvatarService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const data = await this.authService.login(req.user)
    if (data && data.access_token != "") {
      return {
        message: 'Login exitoso',
        avatar: await this.avatarService.getAvatar(data.user._id),
        data
      }
    } 
  }
}
