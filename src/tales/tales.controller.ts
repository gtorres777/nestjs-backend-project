import { Controller, Body, Post } from '@nestjs/common';
import {CreateTalesDto} from './dto/tales.dto';
import {TalesService} from './tales.service';
import { Tales } from './interface/tales.interface';

@Controller('tales')
export class TalesController {

  constructor(private readonly talesService: TalesService) {}

  @Post()
  addTales(@Body() data: CreateTalesDto): Promise<Tales> {
    return this.talesService.addTales(data);
  }
}
