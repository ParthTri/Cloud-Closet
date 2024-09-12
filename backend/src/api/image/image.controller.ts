import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { UploadImage } from './interface/uploadImage.dto';
import { Image } from './image.entity';

@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  //@UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    //@UploadedFile() file: Express.Multer.File,
    //@Body() body: UploadImage,
    @Body('fileName') fileName: string,
    @Body('categories') categories: string,
    @Body('userID') userID: string,
    @Body('image') image: string,
  ): Promise<any> {
    console.log(fileName);
    console.log(categories);
    console.log(userID);

    // Convert the comma-separated list of categories into an array of numbers
    const categoriesArray = categories
      .split(',')
      .map((category) => Number(category));
    for (const el of categoriesArray) {
      console.log(el);
    }

    const imageID = await this.imageService.uploadUserImage(
      image,
      fileName,
      categoriesArray,
      userID,
    );
    return { imageID: imageID };
  }

  @Delete(':id')
  async deleteImage(@Param('id') imageID: number): Promise<string> {
    await this.imageService.deleteUserImage(imageID);
    return 'Deleted';
  }

  @Get(':userId')
  async getImagesByUserId(@Param('userId') userId: string): Promise<any> {
    return { data: await this.imageService.getImagesByUserId(userId) };
  }

  @Get('/search/:userId/:keyword')
  async searchImageByKeyWord(
    @Param('userId') userId,
    @Param('keyword') keyword: string,
  ): Promise<any> {
    const data = await this.imageService.searchImageByKeyWord(keyword, userId);

    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }

  @Get('/filter/:userId/:categories')
  async filterImageByCategory(
    @Param('userId') userId,
    @Param('categories') categories: string,
  ): Promise<any> {
    // Convert the comma-separated list of categories into an array of numbers
    const categoriesArray = categories
      .split(',')
      .map((category) => Number(category));

    const data = await this.imageService.filterImageByCategory(
      categoriesArray,
      userId,
    );

    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }
}
