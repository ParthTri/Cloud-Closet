import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryService } from './category.service';
import { ImageService } from './image.service';
import { DatabaseHelper } from './database.helper';
import { StorageHelper } from './storage.helper';
import { ClosetController } from './closet.controller';
@Module({
  imports: [],
  controllers: [AppController, ClosetController],
  providers: [AppService, DatabaseHelper, CategoryService, StorageHelper ,ImageService],
})
export class AppModule {}
