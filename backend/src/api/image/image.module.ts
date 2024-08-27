import { Module } from '@nestjs/common';
import { DatabaseHelper } from '../../database.helper';
import { StorageHelper } from '../../storage.helper';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, User])],
  controllers: [ImageController],
  providers: [DatabaseHelper, StorageHelper, ImageService],
})
export class ImageModule {}
