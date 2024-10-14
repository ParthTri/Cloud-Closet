import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';
import { removeBackground } from '@imgly/background-removal-node';
import { FileUploadDTO, FileUploadErrorDTO } from './interface/fileUpload.dto';
import { ImageDTO } from './interface/image.dto';
import { CategoryService } from '../category/category.service';
import { OutfitService } from '../outfit/outfit.service';

@Injectable()
export class ImageService {
  constructor(
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => OutfitService)) // Use forwardRef here
    private readonly outfitService: OutfitService,
  ) {}

  async uploadUserImage(
    image: string,
    fileName: string,
    categories: string,
    userId: string,
  ): Promise<FileUploadDTO | FileUploadErrorDTO> {
    console.log(image);
    console.log(fileName);
    console.log(categories);
    console.log(userId);
    
    const responseData: FileUploadDTO = {
      rawData: {
        id: '',
        path: '',
        fullPath: '',
      },
      processedData: {
        id: '',
        path: '',
        fullPath: '',
      },
      rawUrl: '',
      processedUrl: '',
      imageId: '',
    };
    // Upload user image
    const client = this.supa.getClient();
    const fileUploadName = `raw-${uuidv1()}.png`;
    console.log('Raw blob name ' + fileUploadName);

    // Conver the image into a ArrayBuffer from string in base64
    const binaryString = atob(image);
    const fileBuf = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(fileBuf);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    const { data: rawData, error: rawError } = await client.storage
      .from('cloudcloset')
      .upload(`rawImages/${fileUploadName}`, uint8Array.buffer, {
        contentType: `image/png`,
      });

    if (rawError) {
      return {
        data: null,
        error: rawError,
      };
    }

    responseData.rawData = rawData;
    const { data } = client.storage
      .from('cloudcloset')
      .getPublicUrl(rawData.path);
    responseData.rawUrl = data.publicUrl;

    let backgroundRemoved: Blob | ArrayBuffer = await removeBackground(
      data.publicUrl,
    );

    backgroundRemoved = await new Response(backgroundRemoved).arrayBuffer();
    const processedName = `processed-${uuidv1()}.png`;

    const { data: processedData, error: processedError } = await client.storage
      .from('cloudcloset')
      .upload(`processedImages/${processedName}`, backgroundRemoved, {
        contentType: 'image/png',
      });

    if (processedError) {
      return {
        data: null,
        error: processedError,
      };
    }

    responseData.processedData = processedData;
    const { data: processedUrl } = client.storage
      .from('cloudcloset')
      .getPublicUrl(processedData.path);

    responseData.processedUrl = processedUrl.publicUrl;

    // Insert image data in to Image table
    const { data: insertData, error: insertError } = await client
      .from('Image')
      .insert({
        rawUrl: responseData.rawUrl,
        processedUrl: responseData.processedUrl,
        userId: userId,
      })
      .select();

    if (insertError) {
      return {
        error: insertError,
      };
    }

    responseData.imageId = insertData[0].imageId;

    // Insert Category data in to ImageCategory
    // categories.forEach(async (name) => {
    //   // Get the category id from the name
    //   const { data, error } = await client
    //     .from('ItemCategory')
    //     .select('id')
    //     .eq('name', name.toLowerCase());

    //   if (error) {
    //     return;
    //   }

    //   const { error: categoryError } = await client
    //     .from('ImageCategory')
    //     .insert({
    //       imageId: insertData[0].imageId,
    //       categoryId: data[0].id,
    //     });

    //   if (categoryError) {
    //     return;
    //   }
    // });

    // Insert Category data in to ImageCategory
     // Convert the comma-separated list of categories into an array of numbers
     const categoriesArray = categories.split(',').map((category) => Number(category));
    // Insert to ImageCategory database
     for(const element of categoriesArray)
     {
      const { error: categoryError } = await client
        .from('ImageCategory')
        .insert({
          imageId: insertData[0].imageId,
          categoryId: element,
        });

      if (categoryError) {
        return;
      }

     }


    return responseData;
  }

  async getImagesByUserId(userId: string): Promise<{data, error}> {

    // Check userId is null
    if (!userId)
    {
      return {data: null, error: "Invalid userId"};
    }
    const rows = await this.supa
      .getClient()
      .from('Image')
      .select('*')
      .eq('userId', userId);
    if (rows.error) {
      return { data: null, error: rows.error };
    }

    let images = Array <ImageDTO>();

    for (const image of rows.data)
    {
      const categories = (await this.categoryService.getImageCategoriesByImageId(image.imageId)).data;
      images.push({
        imageId: image.imageId,
        created_at: image.created_at,
        rawUrl: image.rawUrl,
        processedUrl: image.processedUrl,
        userId: image.userId,
        categories: categories
      });
    }
    return { data: images, error: rows.error };
  }

  async getImageInfoByImageId(imageId: string): Promise<{data, error}> {

    const row = await this.supa
      .getClient()
      .from('Image')
      .select('*')
      .eq('imageId', imageId);
    if (row.error) {
      return { data: null, error: row.error };
    }

    //Get image categories
    const imageCategories = (await this.categoryService.getImageCategoriesByImageId(imageId)).data;
    
    const image: ImageDTO = {
      imageId: row.data[0].imageId,
      created_at: row.data[0].created_at,
      rawUrl: row.data[0].rawUrl,
      processedUrl: row.data[0].processedUrl,
      userId: row.data[0].userId,
      categories: imageCategories
    };

    return { data: image, error: row.error};
  }

  async deleteUserImage(imageId: string): Promise<any> {
    // Delete outfit which contains imageId
    // Find outfit contains imageId
    const outfitRows = (await this.outfitService.getAllOutfitIdsbyImageId(imageId)).data;
    if (outfitRows)
    {
      for (const outfitId of outfitRows)
      {
        await this.outfitService.deleteOutfit(outfitId);
      }
    }
    
    //Delete categoryImage
    const categoryDelete = await this.supa
      .getClient()
      .from('ImageCategory')
      .delete()
      .eq('imageId', imageId);

    if (categoryDelete.status != 204) {
      return {
        error: categoryDelete,
      };
    }

    // Delete in Image table

    const imageDelete = await this.supa
      .getClient()
      .from('Image')
      .delete()
      .eq('imageId', imageId);

    if (imageDelete.status != 204) {
      return {
        error: imageDelete,
      };
    }

    return {
      data: 'Image deleted',
      status: 200,
    };
  }

    async searchImageByKeyWord(keyword: string, userId: string): Promise<{data, error}> {
      //Check userId is null
      if (!userId)
      {
        return {data: null, error: "Invalid userId"};
      }

      
      let searchResult = new Array<ImageDTO>();

      // Get all clothing items of the user   
      let queryImagesResult = await this.getImagesByUserId(userId);

      // Check if the database query gets error
      if (!queryImagesResult.data){
          return {data: null, error: queryImagesResult.error };
      }

      const allUserimages = queryImagesResult.data;

      // Check if keyword = null
      if (keyword == null) {
        return { data: allUserimages, error: null };
      }

      for (const image of allUserimages) {
        // Check if any category name matches the keyword
        let hasKeyword = false;
        for (const cat of image.categories) {
          if (cat.name.toLowerCase().includes(keyword.toLowerCase())) {
              hasKeyword = true;
              break;
          }
          }
          if (hasKeyword) {
            searchResult.push(image);
          }
        }
        
        return {data: searchResult, error: null};
      
    }
}

  //   async filterImageByCategory(
  //     categories: Array<number>,
  //     userId,
  //   ): Promise<Array<Image>> {
  //     let filterResult = new Array<Image>();

  //     const allUserimages = await this.getImagesByUserId(userId);

  //     console.log(allUserimages);

  //     // Convert the array of numbers to an array of BigInt for comparison
  //     const bigIntCategories = categories.map((cat) => BigInt(cat));

  //     // Iterate over all user images
  //     for (const image of allUserimages) {
  //       // Check if any category id of the image matches the provided categories
  //       let hasCategory = false;
  //       for (const cat of image.categories) {
  //         if (categories.includes(Number(cat.categoryID))) {
  //           hasCategory = true;
  //           break;
  //         }
  //       }
  //       if (hasCategory) {
  //         filterResult.push(image);
  //       }
  //     }
  //     return filterResult;
  //   }



