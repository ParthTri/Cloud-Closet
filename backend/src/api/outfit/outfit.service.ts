import { Injectable, Inject } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';
import { Outfit, OutfitImage } from './interfaces/outfit.dto';
import { ImageService } from '../image/image.service';
import { OutfitCategoryService } from './outfitCategory/outfitCategory.service';

@Injectable()
export class OutfitService {
  constructor(
    //@Inject(SupabaseProvider)
    private supa: SupabaseProvider,
    private readonly outfitCategoryService: OutfitCategoryService,
    private readonly imageService: ImageService,
  ) {}

async createOutfitByUser(userId: string, outfitName: string, joinImageIdsString: string, joincategoryIdsString: string): Promise<any> {
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
  error: insertError,
};
}

let outfitId = insertData[0].outfitId;
  
  // Insert to OutfitsCategory table
  // Get all category Ids
  let allCategoryIds = joincategoryIdsString.split(',');
  for(const categoryId of allCategoryIds)
  {
    //Insert into OutfitImage
    const { error: categoryError } = await this.supa.getClient()
        .from('OutfitsCategory')
        .insert({
          outfitId: outfitId,
          categoryId: categoryId,
        });

      if (categoryError) {
        return;
      }
  }

  // Insert to OutfitImage table
  // Get all image Ids
  let allImageIds = joinImageIdsString.split(',');
  for(const imageId of allImageIds)
  {
    //Insert into OutfitImage
    const { error: imageError } = await this.supa.getClient()
        .from('OutfitImage')
        .insert({
          outfitId: outfitId,
          imageId: imageId,
        });

      if (imageError) {
        return;
      }
  }
  
  return `Created '${outfitName}' successfully.`;

}
async getAllOutfitbyUserId(userId: string): Promise<{data, error}> {

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
    let outfitCreateAt = outfit.created_at;
   
    // Get outfit categories
    let outfitCategories = (await this.outfitCategoryService.getOutfitCategoriesByOutfitId(outfitId)).data;
    
    // Get all images
    let images = (await this.getImageIdsByOutfitId(outfitId)).data;
    let allOutfitImages = new Array <OutfitImage>();

    if (images)
    {
      for (const image of images)
      {
        console.log(image.imageId);
        let imageInfo = (await this.imageService.getImageInfoByImageId(image.imageId)).data[0];
        let imageUrl = String(imageInfo.processedUrl);
          allOutfitImages.push({imageId: image.imageId,
          proccessedUrl: imageUrl});
      }
    }

    outfitGallery.push({
      Id: outfitId,
      name: outfitName,
      userID: userId,
      categories: outfitCategories,
      images: allOutfitImages}); 

  }

  return {data:outfitGallery, error: outfitRows.error};
   
}

// Get all info of an outfit by outfit ID 
// return data: null if there is error
//return data, include: outfitID, create_at, name, userId if there is no error
  async getImageIdsByOutfitId(outfitId: string): Promise<{data,error}> {
    const outfitRow = await this.supa
    .getClient()
    .from('OutfitImage')
    .select('imageId')
    .eq('outfitId', outfitId);
  if (outfitRow.error) {
    return { data: null, error: outfitRow.error };
  }
  return { data: outfitRow.data, error: outfitRow.error };
}


}
