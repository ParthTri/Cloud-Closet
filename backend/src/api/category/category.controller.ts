import { Controller, Get, HttpStatus, Param} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('/api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<{data, error}> {
    const {data, error} = await this.categoryService.getAllCategories();

    return {data, error };
  }

    @Get('/:imageId')
    async getImageCategoriesByImageId(@Param('imageId') imageId: string): Promise<{data, error}> {
      const {data, error} = await this.categoryService.getImageCategoriesByImageId(imageId);

      return {data, error};
    }
}
