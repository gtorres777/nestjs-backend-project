import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProfileUserDto } from "./dtos/user-profile.dto";
import { ProfileUser } from "./interface/user-profile.interface";
import { UserProfileService } from "./user-profile.service";

@Controller('profile')
export class UserProfileController {

  constructor(private readonly userProfileService: UserProfileService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  addProfile(
    @Req() req,
    @Body() data: CreateProfileUserDto
  ) : Promise<ProfileUser> {
    return this.userProfileService.addProfile(data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(
    @Req() req,
  ) : Promise<ProfileUser> {
    return this.userProfileService.getProfile(req.user.userId);
  }

}
