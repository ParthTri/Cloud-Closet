import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileUploadDTO, FileUploadErrorDTO } from './interface/fileUpload.dto';
import { console } from 'inspector';

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
  async deleteImage(@Param('id') imageID: string): Promise<any> {
    return await this.imageService.deleteUserImage(imageID);
  }

  @Get(':userId')
  async getImagesByUserId(@Param('userId') userId: string): Promise<{data, error}> {
    return await this.imageService.getImagesByUserId(userId);
  }

  @Get('/imageId/:imageId')
  async getImagesByImageId(@Param('imageId') imageId: string): Promise<{data, error}> {
    console.log("Into this API");
    console.log(imageId);
    return await this.imageService.getImageInfoByImageId(imageId);
  }

    @Get('/search/:userId/:keyword')
    async searchImageByKeyWord(
      @Param('userId') userId,
      @Param('keyword') keyword: string,
    ): Promise<{data, error}> {
      const {data, error} = await this.imageService.searchImageByKeyWord(keyword, userId);

      return {data, error};
    }

  //   @Get('/filter/:userId/:categories')
  //   async filterImageByCategory(
  //     @Param('userId') userId,
  //     @Param('categories') categories: string,
  //   ): Promise<any> {
  //     // Convert the comma-separated list of categories into an array of numbers
  //     const categoriesArray = categories
  //       .split(',')
  //       .map((category) => Number(category));

  //     const data = await this.imageService.filterImageByCategory(
  //       categoriesArray,
  //       userId,
  //     );

  //     return {
  //       statusCode: HttpStatus.OK,
  //       data: data,
  //     };
  //   }
}
