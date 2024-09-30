import { Body, Controller, Get, Post } from '@nestjs/common';
import { ImageService } from './image.service';
import { UserImageDTO } from './interface/userImage.dto';
import { FileUploadDTO, FileUploadErrorDTO } from './interface/fileUpload.dto';

@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  async uploadImage(
    @Body('fileName') fileName: string,
    @Body('categories') categories: string[],
    @Body('userId') userID: string,
    @Body('image') image: string,
  ): Promise<FileUploadDTO | FileUploadErrorDTO> {
    const res = await this.imageService.uploadUserImage(
      image,
      fileName,
      categories,
      userID,
    );
    return res;
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
