import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProfileUserDto } from "./dtos/user-profile.dto";
import { ProfileUser, VideoReference } from "./interface/user-profile.interface";
import {buyTimeForVideo} from './interface/uservideos.interface';
import { UserProfileService } from "./user-profile.service";

@Controller('profile')
export class UserProfileController {

  constructor(private readonly userProfileService: UserProfileService) {}


  // @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get("videos")
  getVideosUser(
    @Req() req,
  ) : Promise<VideoReference[]> {
    return this.userProfileService.getAllVideos(req.user.userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('updateVideo')
  async buyTimeForVideo(@Req() req, @Body() data: buyTimeForVideo) {
    const response = await this.userProfileService.buyTimeForVideo(data.videoId, req.user.userId, data.coins) 
    return {
      message: response.message,
      data: response.data
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('stadistics')
  async getStadistics(@Req() req) {
    const response = await this.userProfileService.getStadistics(req.user.userId) 
    return {
      message: response.message,
      stadistics: response.stadistics
    }
  }

}
