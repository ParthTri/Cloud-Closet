import { Module, forwardRef } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import {OutfitModule} from '../outfit/outfit.module';

@Module({
  imports: [forwardRef(() => OutfitModule)],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService]
})
export class ImageModule {}
