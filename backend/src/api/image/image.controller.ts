import { Controller, Get, Param, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ImageService } from './image.service';


@Controller("/api/images")
export class ImageController {
  constructor(private readonly imageService: ImageService
  ) { }


  @Post("/upload")
  async uploadImage(@Body() req: any): Promise<any> {
    await this.imageService.uploadUserImage(req.userId, req.image, req.fileName, req.categories);

    return {
      "statusCode": HttpStatus.OK,
      "message": "Uploaded"
    };
  }

  @Post("/delete")
  async deleteImage(@Body() req: { imageIDs: Array<number> }): Promise<any> {
    if (!req.imageIDs || req.imageIDs.length === 0) {
      throw new HttpException ({
        "statusCode": HttpStatus.BAD_REQUEST,
        "message": "No image IDs provided"
      }, HttpStatus.BAD_REQUEST);
      
    }

    await this.imageService.deleteImage(req.imageIDs);
      
    return {
      "statusCode": HttpStatus.OK,
      "message": "Deleted"
    };
  }

  @Get("/:userId")
  async getImagesByUserId(@Param('userId') userId): Promise<any> {
    const data = await this.imageService.getImagesByUserId(userId);

    return {
      "statusCode": HttpStatus.OK,
      "data": data
    };
  }

  @Get("/search/:userId/:keyword")
  async searchImageByKeyWord(@Param('userId') userId, @Param('keyword') keyword: string): Promise<any> {
    const data = await this.imageService.searchImageByKeyWord(keyword, userId);

    return {
      "statusCode": HttpStatus.OK,
      "data": data
    };
  }

  @Get("/filter/:userId/:categories")
  async filterImageByCategory(@Param('userId') userId, @Param('categories') categories: Array<number>): Promise<any> {
    const data = await this.imageService.filterImageByCategory(categories, userId);

    return {
      "statusCode": HttpStatus.OK,
      "data": data
    };
  }
}
