import {
  Body,
  Controller, Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { Payload } from '../types';

import { CatDto, CreateCatDto } from './cats.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(): Array<{
    id: number,
    name: string
  }>  {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Payload<CatDto> {
    const cat = this.catsService.findOne(id);
    return cat ? { payload: cat } : { error: `Cat with id=${id} not found` };
  }

  @Get('photo/:id')
  findPhoto(
    @Headers('x-api-key') apiKey,
    @Param('id') id: string,
  ): Payload<string> {
    if (apiKey !== 'vzuh') {
      throw new HttpException('Wrong api key', HttpStatus.UNAUTHORIZED);
    }

    const photo = this.catsService.findPhoto(id);
    return photo
      ? { payload: photo }
      : { error: `Cat's photo by id=${id} not found` };
  }

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) body: CreateCatDto, // useGlobalPipes
  ): Payload<string> {
    this.catsService.create(body);

    return {
      payload:
        'Спасибо за добавление нового котика в базу.',
    };
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Payload<String> {
    return this.catsService.deleteCat(id);
  }
}
