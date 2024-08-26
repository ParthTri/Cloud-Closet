import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';



@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService
  ) {}


  @Get("api/categories")
  async getAllCategories(): Promise<string> {
    return this.categoryService.getAllCategories();
  }

  @Get("api/category/:id")
  async getCategoryById(@Param('id') id): Promise<string> {
    return this.categoryService.getCategoryById(id);
  }


}
