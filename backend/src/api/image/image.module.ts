import { Module } from '@nestjs/common';
import { DatabaseHelper } from 'src/database.helper';
import { StorageHelper } from 'src/storage.helper';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';


@Module({
  imports: [],
  controllers: [ImageController],
  providers: [DatabaseHelper, StorageHelper, ImageService],

})
export class ImageModule {}


