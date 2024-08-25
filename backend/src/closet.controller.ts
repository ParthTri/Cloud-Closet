import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ImageService } from './image.service';
import { UserImage } from './userimage';

@Controller()
export class ClosetController {
  constructor(private readonly categoryService: CategoryService,
    private readonly imageService: ImageService
  ) {}


  @Get("api/categories")
  async getAllCategories(): Promise<string> {
    return this.categoryService.getAllCategories();
  }

  @Get("api/category/:id")
  async getCategoryById(@Param('id') id): Promise<string> {
    return this.categoryService.getCategoryById(id);
  }

  @Post("api/upload")
  async uploadImage(@Body() req: any): Promise<string> {
    await this.imageService.uploadUserImage(req.image, req.fileName, req.categories);
    
    return "Uploaded";
  }

  @Post("api/delete")
  async deleteImage(@Body() req: any): Promise<string> {
    await this.imageService.deleteUserImage(req.imageName);
    return "Deleted";
  }

  @Get("api/images/:userId")
  async getImagesByUserId(@Param('userId') userId): Promise<Array<UserImage>> {
    return await this.imageService.getImagesByUserId(userId);
  }
}
