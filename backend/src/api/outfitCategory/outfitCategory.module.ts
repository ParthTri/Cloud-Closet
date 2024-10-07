import { Module } from '@nestjs/common';
import { OutfitCategoryController } from './outfitCategory.controller';
import { OutfitCategoryService } from './outfitCategory.service';


@Module({
  controllers: [OutfitCategoryController],
  providers: [OutfitCategoryService],
  exports: [OutfitCategoryService]
})
export class OutfitCategoryModule {}
