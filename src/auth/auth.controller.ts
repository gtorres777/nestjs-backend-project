import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req) {
    console.log("controller")
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  hola(@Req() req) {
    console.log(req)
    return this.authService.getProfile(req.user.userId)
  }

}
