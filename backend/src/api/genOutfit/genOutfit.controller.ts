import { Controller, Get, Body } from '@nestjs/common';
import { GenOutfitDTO } from './interface/genOutfit.dto';
import { GenOutfitService } from './genOutfit.service';

@Controller('api/genOutfit')
export class GenOutfitController {
  constructor(private readonly genService: GenOutfitService) {}

  @Get()
  async generateOutfit(@Body() input: GenOutfitDTO) {
    console.log(input);
    this.genService.generateOutft(input);

    return { data: 'hello World' };
  }
}
