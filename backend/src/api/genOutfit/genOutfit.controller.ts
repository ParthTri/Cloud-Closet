import { Controller, Get, Body } from '@nestjs/common';
import { GenOutfitDTO } from './interface/genOutfit.dto';
import { GenOutfitService } from './genOutfit.service';

@Controller('api/genOutfit')
export class GenOutfitController {
  constructor(private readonly genService: GenOutfitService) {}

  @Get()
  async generateOutfit(@Body() input: GenOutfitDTO) {
    return await this.genService.generateOutft(input);
  }
}
