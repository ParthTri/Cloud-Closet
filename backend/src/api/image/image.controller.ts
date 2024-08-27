import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { UploadImage } from './interface/uploadImage.dto';
import { Image } from './image.entity';

@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImage,
  ): Promise<any> {
    const imageID = await this.imageService.uploadUserImage(
      file.buffer,
      body.fileName,
      body.categories,
      body.userID,
    );
    return { imageID: imageID };
  }

  @Delete(':id')
  async deleteImage(@Param('id') imageID: number): Promise<string> {
    await this.imageService.deleteUserImage(imageID);
    return 'Deleted';
  }

  @Get(':userId')
  async getImagesByUserId(@Param('userId') userId: string): Promise<Image[]> {
    return await this.imageService.getImagesByUserId(userId);
  }
}
