import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/interface/user.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {

    const user = await this.userService.findOne(username);

    if (user && (await user.verifyPassword(pass))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, id: user._id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  // async getProfile(id: string) {
  //   return await this.userService.getProfile(id);
  // }

}
