import { Module } from '@nestjs/common';
import { OutfitCategoryController } from './outfitCategory.controller';
import { OutfitCategoryService } from './outfitCategory.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [OutfitCategoryController],
  providers: [OutfitCategoryService],
})
export class OutfitCategoryModule {}
