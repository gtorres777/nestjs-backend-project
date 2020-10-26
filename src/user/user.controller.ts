import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  addUser(@Body() data: CreateUserDto): Promise<User> {
    console.log("@@@@", data)
    return this.userService.addUser(data);
  }



}
