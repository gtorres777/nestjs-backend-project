import {
  Controller,
  Body,
  Post,
  Put,
  Param,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTalesDto } from './dto/tales.dto';
import { TalesService } from './tales.service';
import { Tales } from './interface/tales.interface';
import { UpdateTalesDto } from './dto/update-tales.dto';

@Controller('tales')
export class TalesController {
  constructor(private readonly talesService: TalesService) {}

  @Get()
  getAllTales(): Promise<Tales[]> {
    return this.talesService.getAll()
  }

  @Get(':id')
  async getOneTale(@Param('id') id: string): Promise<Tales> {
    const tale = await this.talesService.getOneTale(id);
    if (!tale) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'El recurso no existe',
      }, HttpStatus.NOT_FOUND);
    }
    return tale;
  }

  @Post()
  addTales(@Body() data: CreateTalesDto): Promise<Tales> {
    console.log(data);
    return this.talesService.addTales(data);
  }

  @Put(':id')
  updateTales(
    @Param('id') id: string,
    @Body() data: UpdateTalesDto,
  ): Promise<Tales> {
    return this.talesService.updateTales(data, id);
  }
}
