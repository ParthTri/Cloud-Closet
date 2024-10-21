import { Injectable, Inject } from '@nestjs/common';
import { SupabaseProvider } from '../../supabase/supabase.service';
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

return { data: row.data[0].name, error: row.error};    
}

// Insert a new category into OutfitsCategory
async AddANewCategoryIntoAnOutfit(outfitId: string, insertOutfitCategoryId: number): Promise<{data, error}> {
  // Check if the insert category exists in the current database
  const { data: allOutfitCategories, error: categoriesError } = await this.getAllOutfitCategories();

  if (categoriesError) {
    return {data: null, error: categoriesError};
  }

  if (Array.isArray(allOutfitCategories) && allOutfitCategories.length > 0) {
    const existsInAll = allOutfitCategories.some(cat => cat.id === insertOutfitCategoryId);
    if (!existsInAll) {
      return {data: null, error: "Not existing!"};
    }
  }

  // Check if the insert category already exists in that outfit
  const { data: currentCategoryArray, error: outfitError } = await this.getOutfitCategoriesByOutfitId(outfitId);

  if (outfitError) {
    return {data: null, error:outfitError};
  }

  if (Array.isArray(currentCategoryArray) && currentCategoryArray.length > 0) {
    const existsInOutfit = currentCategoryArray.some(cat => cat.id === insertOutfitCategoryId);
  
    if (existsInOutfit) {
      return {data: null, error:"The outfit has that category already"};
    }
  }

 //Insert into OutfitsCategory
 const { error: categoryError } = await this.supa.getClient()
 .from('OutfitsCategory')
 .insert({
   outfitId: outfitId,
   categoryId: insertOutfitCategoryId,
 });

  if (categoryError) {
    return {data: null, error: categoryError.message};
  }

  return {data: "Add category successfully", error: null} // Return success message
}

// Delete an outfit category by outfitId and categoryId
async deleteACategoryInOutfit(outfitId: string, categoryId: number): Promise<string> {
  // Check if the category exists for the given outfitId
  const { data: existingCategory, error: checkError } = await this.supa.getClient()
    .from('OutfitsCategory')
    .select('*')
    .eq('outfitId', outfitId)
    .eq('categoryId', categoryId)
    .single(); // Use .single() to get a single row

  if (checkError) {
    return `Error checking category existence: '${checkError.message}'`;
  }

  if (!existingCategory) {
    return "The specified category does not exist for this outfit.";
  }

  // Perform the deletion
  const { error: deleteError } = await this.supa.getClient()
    .from('OutfitsCategory')
    .delete()
    .eq('outfitId', outfitId)
    .eq('categoryId', categoryId);

  if (deleteError) {
    return `Can't delete from OutfitsCategory because of Error: '${deleteError.message}'`;
  }

  return "Category deleted successfully"; // Return success message
}


}
