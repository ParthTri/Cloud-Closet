import { Module } from '@nestjs/common';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import {OutfitCategoryService} from './outfitCategory/outfitCategory.service';
import { ImageService } from '../image/image.service';

@Module({
  imports: [SupabaseModule],
  controllers: [OutfitController],
  providers: [OutfitService, OutfitCategoryService, ImageService],
})
export class OutfitModule {}
