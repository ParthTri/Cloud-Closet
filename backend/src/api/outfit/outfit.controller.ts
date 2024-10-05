import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { OutfitService} from './outfit.service';


@Controller('api/outfit')
export class OutfitController {
  constructor(private readonly outfitService: OutfitService) {}

  @Post()
  async createOutfitByUser(
    @Body('userId') userId: string,
    @Body('outfitName') outfitName: string,
    @Body('joinImageIdsString') joinImageIdsString: string,
    @Body('joincategoryIdsString') joincategoryIdsString: string,
  ): Promise<any> {
    const res = await this.outfitService.createOutfitByUser(
      userId,
      outfitName,
      joinImageIdsString,
      joincategoryIdsString,
    );
    return res;
  }

 @Get('/userId/:userId')
  async getAllUserOutfit(@Param('userId') userId: string): Promise<any> {
    console.log("Call API");
    return await this.outfitService.getAllOutfitbyUserId(userId);
  }

  @Get('/outfitId/:outfitId')
  async getOutfitInfoById(@Param('outfitId') outfitId: string): Promise<any> {
    console.log("Call API to get outfit Info by its id");
    return await this.outfitService.getImageIdsByOutfitId(outfitId);
  }


}