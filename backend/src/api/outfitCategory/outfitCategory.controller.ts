import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
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
}
