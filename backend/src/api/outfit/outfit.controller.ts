import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { OutfitService} from './outfit.service';


@Controller('api/outfit')
export class OutfitController {
  constructor(private readonly outfitService: OutfitService) {}

  // User create outfit
  @Post()
  async createOutfitByUser(
    @Body('userId') userId: string,
    @Body('outfitName') outfitName: string,
    @Body('joinImageIdsString') joinImageIdsString: string,
    @Body('joincategoryIdsString') joincategoryIdsString: string,
  ): Promise<any> {
    console.log("TEST API CREATE OUTFIT");
    const res = await this.outfitService.createOutfitByUser(
      userId,
      outfitName,
      joinImageIdsString,
      joincategoryIdsString,
    );
    return res;
  }

  // Get all outfit of a user
  // Each outfit includes: Id, created_at, name, userID, categories: OutfitCategory[], images: ImageDTO[];
 @Get('/userId/:userId')
  async getAllUserOutfit(@Param('userId') userId: string): Promise<any> {
    console.log("Call API");
    console.log(userId);
    return await this.outfitService.getAllOutfitbyUserId(userId);
  }

  // Get all info of an outfit by its Id
  // Info: 
  // Id, created_at, name, userID, categories: OutfitCategory[], images: ImageDTO[]; 
  @Get('/outfitId/:outfitId')
  async getImagesByOutfitId(@Param('outfitId') outfitId: string): Promise<any> {
    console.log("Call API to get outfit Info by its id");
    return await this.outfitService.getImagesByOutfitId(outfitId);
  }

  // Get all outfit ID by Image Id
  // Return data and error
  // If successfully: data: an array of outfitId
 @Get('/imageId/:imageId')
 async getAllOutfitIdsbyImageId(@Param('imageId') imageId: string): Promise<any> {
  console.log(imageId);
   return await this.outfitService.getAllOutfitIdsbyImageId(imageId);
 }

  // Delete outfit by outfit ID
  @Delete(':outfitId')
  async deleteImage(@Param('outfitId') outfitId: string): Promise<any> {
    return await this.outfitService.deleteOutfit(outfitId);
  }

}