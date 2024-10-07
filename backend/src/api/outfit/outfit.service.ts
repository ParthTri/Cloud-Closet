import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';
import { Outfit } from './interfaces/outfit.dto';
import { ImageService } from '../image/image.service';
import { OutfitCategoryService } from '../outfitCategory/outfitCategory.service';
import { console } from 'inspector';
import { ImageDTO } from '../image/interface/image.dto';

@Injectable()
export class OutfitService {
  constructor(
    //@Inject(SupabaseProvider)
    private supa: SupabaseProvider,
    private readonly outfitCategoryService: OutfitCategoryService,
    @Inject(forwardRef(() => ImageService)) // Use forwardRef here
    private readonly imageService: ImageService,
    
  ) {}

// Create outfit by user
// Input: userId, outfitName, join Image Ids string, join outfit category Ids string
// Return: data, error 
// If successfully: data: outfitId, error: null
// If unsuccessfully: data: null, error: ...

async createOutfitByUser(
  userId: string, 
  outfitName: string,
  joinImageIdsString: string,
  joincategoryIdsString: string)
  : Promise<{data, error}> {
  console.log("TEST API CREATE OUTFIT in service");
  console.log(`All data: userID: ${userId},\n outfitName: ${outfitName}, \n joinImageIdsString ${joinImageIdsString},\n joincategoryIdsString ${joincategoryIdsString}`);
  // Insert into Outfit table
const { data: insertData, error: insertError } = await this.supa.getClient()
.from('Outfit')
.insert({
    name: outfitName,
    userId: userId,
})
.select();

if (insertError) {
return {
  data: null, error: insertError
};
}
console.log("inserted to Outfit table");

let outfitId = insertData[0].outfitId;
  
  // Insert to OutfitsCategory table
  // Get all category Ids
  let allCategoryIds = joincategoryIdsString.split(',');
  for(const categoryId of allCategoryIds)
  {
    //Insert into OutfitsCategory
    const { error: categoryError } = await this.supa.getClient()
        .from('OutfitsCategory')
        .insert({
          outfitId: outfitId,
          categoryId: categoryId,
        });

      if (categoryError) {
        return { data: null, error: categoryError};
      }
  }

  console.log("inserted to OutfitsCategory table");

  // Insert to OutfitImage table
  // Get all image Ids
  let allImageIds = joinImageIdsString.split(',');
  console.log(`image ID: ${allImageIds}`);
  for(const imageId of allImageIds)
  {
    //Insert into OutfitImage
    const { error: outfitimageError } = await this.supa.getClient()
        .from('OutfitImage')
        .insert({
          outfitId: outfitId,
          imageId: imageId,
        });

      if (outfitimageError) {
        return {data: null, error: outfitimageError};
      }
  }
  console.log("inserted to OutfitImage table");
  
  
  return {data: outfitId , error: null};

}
async getAllOutfitbyUserId(userId: string): Promise<{data, error}> {
  console.log("GET ALL OUTFIT BY USERID");

  let outfitGallery = new Array<Outfit>();
  
    const outfitRows = await this.supa
    .getClient()
    .from('Outfit')
    .select('*')
    .eq('userId', userId);
  if (outfitRows.error) {
    return {data: null,
    error: outfitRows.error};
  }
  
  let returnOutfits = {data: outfitRows.data,
    error: outfitRows.error};

  for (const outfit of returnOutfits.data)
  {
    let outfitId = outfit.outfitId;
    let outfitName = outfit.name;
    let outfitCreatedAt = outfit.created_at;
   
    // Get outfit categories
    let outfitCategories = (await this.outfitCategoryService.getOutfitCategoriesByOutfitId(outfitId)).data;
    
    // Get all images
    let allimagesquerry = (await this.getImagesByOutfitId(outfitId));

    if (allimagesquerry.error)
    {
      return allimagesquerry;
    }

    outfitGallery.push({
      Id: outfitId,
      created_at: outfitCreatedAt,
      name: outfitName,
      userID: userId,
      categories: outfitCategories,
      images: allimagesquerry.data}); 
  }

  return {data:outfitGallery, error: outfitRows.error};
   
}

// Get all image Ids of an outfit by outfit ID 
// return data: null if there is error
//return data, include: outfitID, create_at, name, userId if there is no error
  async getImagesByOutfitId(outfitId: string): Promise<{data,error}> {
    const outfitRows = await this.supa
    .getClient()
    .from('OutfitImage')
    .select('*')
    .eq('outfitId', outfitId);
  if (outfitRows.error) {
    return { data: null, error: outfitRows.error };
  }

  let allImagesInOutfit = new Array <ImageDTO>();

  for (const row of outfitRows.data)
  {
    let image = (await this.imageService.getImageInfoByImageId(row.imageId)).data;
    if(!image)
    {
      return {data: null, error: image.error};
    }
    
      allImagesInOutfit.push(image);
  }
 

  return { data: allImagesInOutfit, error: null};
}

// Get all outfit Ids by imageId
async getAllOutfitIdsbyImageId(imageId: string): Promise<{data, error}> {
  const outfitRows = await this.supa
  .getClient()
  .from('OutfitImage')
  .select('*')
  .eq('imageId', imageId);
if (outfitRows.error) {
  return { data: null, error: outfitRows.error };
}

let outfitIds = Array <string>();

for (const outfit of outfitRows.data)
{
  outfitIds.push(outfit.outfitId);
}
  return {data: outfitIds, error: null};
}

// Delete outfit BY outfit id
async deleteOutfit(outfitId: string): Promise<any> {
  //Delete outfitcategory by outfitID
  const outfitcategoryDelete = await this.supa
      .getClient()
      .from('OutfitsCategory')
      .delete()
      .eq('outfitId', outfitId);

  if (outfitcategoryDelete.status != 204) {
        return {
          error: outfitcategoryDelete.error,
        };
      }
  
  // Delete OutfitImage
  const outfitImageDelete = await this.supa
      .getClient()
      .from('OutfitImage')
      .delete()
      .eq('outfitId', outfitId);

  if (outfitImageDelete.status != 204) {
        return {
          error: outfitImageDelete.error,
        };
      }

   // Delete Outfit
   const outfitDelete = await this.supa
   .getClient()
   .from('Outfit')
   .delete()
   .eq('outfitId', outfitId);

if (outfitDelete.status != 204) {
     return {
       error: outfitDelete.error,
     };
   }

  
  return `Deleted Outfit: ${outfitId}`;

}
}
