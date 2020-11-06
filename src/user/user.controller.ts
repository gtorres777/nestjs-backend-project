import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProfileUserDto, CreateUserDto } from './dtos/user.dto';
import { ProfileUser, User } from './interface/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  addUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.addUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("profile")
  addProfile(
    @Req() req,
    @Body() data: CreateProfileUserDto
  ) : Promise<ProfileUser> {
    return this.userService.addProfile(data, req.user.userId);
  }



}
