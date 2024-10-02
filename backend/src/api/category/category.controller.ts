import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
// import { CategoryDTO } from './interfaces/category.dto';

@Controller('/api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<any> {
    const data = await this.categoryService.getAllCategories();

    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }

  //   @Get('/:id')
  //   async getCategoryById(@Param('id') id): Promise<any> {
  //     const data = await this.categoryService.getCategoryById(id);

  //     return {
  //       statusCode: HttpStatus.OK,
  //       data: data,
  //     };
  //   }
}
