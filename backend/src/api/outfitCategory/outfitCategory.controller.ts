import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { OutfitCategoryService } from './outfitCategory.service';

@Controller('api/outfitCategory')
export class OutfitCategoryController {
  constructor(private readonly outfitCategoryService: OutfitCategoryService) {}

  @Get('/all/')
  async getAllOutfitCategories(): Promise<any> {
    return await this.outfitCategoryService.getAllOutfitCategories();
  }

  @Get('/outfitId/:outfitId')
  async getCategoriesByOutfitId(@Param('outfitId') outfitId: string): Promise<{data, error}> {
    return await this.outfitCategoryService.getOutfitCategoriesByOutfitId(outfitId);
  }

  @Get('/categoryName/:categoryId')
  async getCategoryNameByCategoryId(@Param('categoryId') categoryId: number): Promise<{data, error}> {
    return await this.outfitCategoryService.getOutfitCategoryName(categoryId);
  }

  @Delete('/deleteACategoryInOutfit')
  async deleteACategoryInOutfit(
    @Body('outfitId') outfitId: string,
    @Body('outfitCategoryId') outfitCategoryId: number): Promise<any> {
      console.log("CALLING DELETE");
    return await this.outfitCategoryService.deleteACategoryInOutfit(outfitId, outfitCategoryId);
  }

  @Post('/AddOutfitCategory')
  async insertANewCategoryIntoAnOutfit(
    @Body('outfitId') outfitId: string,
    @Body('insertOutfitCategoryId') insertOutfitCategoryId: number): Promise<{data, error}> {    
    return await this.outfitCategoryService.AddANewCategoryIntoAnOutfit(outfitId, insertOutfitCategoryId);
  }
}
