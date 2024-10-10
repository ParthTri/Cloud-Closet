import { Module, Global } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { CategoryService } from './category/category.service';
import { OutfitCategoryService } from './outfitCategory/outfitCategory.service';

@Global()
@Module({
  imports: [SupabaseModule],
  providers: [CategoryService, OutfitCategoryService],
  exports: [CategoryService, OutfitCategoryService, SupabaseModule]
})
export class SharedModule {}