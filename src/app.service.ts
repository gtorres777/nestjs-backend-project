import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello() {
    return "Server status OK";
  }
  
}
