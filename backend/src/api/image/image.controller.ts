import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ImageService } from './image.service';
import { UserImage } from './userimage';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('api/upload')
  async uploadImage(@Body() req: any): Promise<string> {
    await this.imageService.uploadUserImage(
      req.image,
      req.fileName,
      req.categories,
    );

    return 'Uploaded';
  }

  @Post('api/delete')
  async deleteImage(@Body() req: any): Promise<string> {
    await this.imageService.deleteUserImage(req.imageName);
    return 'Deleted';
  }

  @Get('api/images/:userId')
  async getImagesByUserId(@Param('userId') userId): Promise<Array<UserImage>> {
    return await this.imageService.getImagesByUserId(userId);
  }
}
