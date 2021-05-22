// Project libraries
import { Body, Controller, Post, HttpException, HttpStatus, UseFilters } from '@nestjs/common';

// Project files
import { BadRequestFilter } from 'src/helpers/bad-request.filter';
import { MongoExceptionFilter } from 'src/helpers/mongo-exception.filter';
import { CreateUserDto } from './dtos/user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';


@Controller('user')
@UseFilters(BadRequestFilter)
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(MongoExceptionFilter)
  addUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.addUser(data)
  }

}
