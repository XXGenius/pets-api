import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CatDto, CreateCatDto } from './cats.dto';
import { CatsService } from './cats.service';

interface PayloadFailure {
  error: string;
}
interface PayloadSuccess<T> {
  payload: T;
}

type Payload<T> = PayloadSuccess<T> | PayloadFailure;

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(): CatDto[] {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Payload<CatDto> {
    const cat = this.catsService.findOne(Number(id));
    return cat ? { payload: cat } : { error: `Cat with id=${id} not found` };
  }

  @Post()
  create(@Body() body: CreateCatDto) {
    this.catsService.create(body);
    return 'Спасибо за добавление нового котика в базу. Он будет отображен в общем списке после одобрения администратором.';
  }
}