import { Injectable } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';
import { CategoryDTO } from './interfaces/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly supa: SupabaseProvider) {}

  async getAllCategories(): Promise<{data, error}> {
    const { data, error } = await this.supa
      .getClient()
      .from('ItemCategory')
      .select('*');
    return {data, error};
  }

  async getImageCategoryName(categoryId: number): Promise<{data, error}> {
    const row = await this.supa
      .getClient()
      .from('ItemCategory')
      .select('name')
      .eq('id', categoryId);

      if (row.error) {
        return { data: null, error: row.error };
      }
      
      console.log(row.data);
      console.log(row.data[0].name);
      
      return { data: row.data[0].name, error: row.error};   
  }

  async getImageCategoriesByImageId(imageId: string): Promise<{data, error}>{
    let categories = new Array <CategoryDTO>();
      const rows = await this.supa
      .getClient()
      .from('ImageCategory')
      .select('categoryId')
      .eq('imageId', imageId);
    if (rows.error) {
      return { data: null, error: rows.error };
    }
    
    for (const cat of rows.data)
    {

      let catId = cat.categoryId;
      console.log(catId);
    
      let catName = String((await this.getImageCategoryName(catId)).data);
      console.log(catName);
      categories.push({categoryId: catId, name: catName});
      console.log(categories);
    }    
    
    return { data: categories, error: rows.error};    
    }

}
