import { Body, Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CategoryDTO } from './interfaces/category.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(@Body() req: CategoryDTO): Promise<Category[]> {
    if (req.userID != null) {
      return await this.categoryService.getUserCategory(req.userID);
    }
    return await this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }
}
