import { Injectable, Inject } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';
import {OutfitCategory} from './interfaces/outfitCategory.dto';


@Injectable()
export class OutfitCategoryService {
  constructor(
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
  ) {}

async getAllOutfitCategories(): Promise<{data, error}> {
    const rows = await this.supa
    .getClient()
    .from('OutfitCategory')
    .select('*');
  if (rows.error) {
    return { data: null, error: rows.error };
  }
  return { data: rows.data, error: rows.error };    
}

async getOutfitCategoriesByOutfitId(outfitId: string): Promise<{data, error}>{

let categories = new Array <OutfitCategory>();
  const rows = await this.supa
  .getClient()
  .from('OutfitsCategory')
  .select('categoryId')
  .eq('outfitId', outfitId);
if (rows.error) {
  return { data: null, error: rows.error };
}

for (const cat of rows.data)
{
  let catId = Number (cat.categoryId);
  console.log(catId);

  let catName = String((await this.getOutfitCategoryName(catId)).data);
  console.log(catName);
  categories.push({id: catId, name: catName});
  console.log(categories);
}


return { data: categories, error: rows.error};    
}

async getOutfitCategoryName(outfitCategoryId: number): Promise<{data, error}>{
  const row = await this.supa
  .getClient()
  .from('OutfitCategory')
  .select('name')
  .eq('id', outfitCategoryId);
if (row.error) {
  return { data: null, error: row.error };
}

console.log(row.data);
console.log(row.data[0].name);

return { data: row.data[0].name, error: row.error};    
}



}
