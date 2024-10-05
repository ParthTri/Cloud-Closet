import { Injectable, Inject } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';
import { UserImageDTO } from './interface/userImage.dto';
import { v1 as uuidv1 } from 'uuid';
import { removeBackground } from '@imgly/background-removal-node';
import { FileUploadDTO, FileUploadErrorDTO } from './interface/fileUpload.dto';
import { error } from 'console';

@Injectable()
export class ImageService {
  constructor(
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
  ) {}

  async uploadUserImage(
    image: string,
    fileName: string,
    categories: string[],
    userID: string,
  ): Promise<FileUploadDTO | FileUploadErrorDTO> {
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
        userId: userID,
      })
      .select();

    if (insertError) {
      return {
        error: insertError,
      };
    }

    responseData.imageId = insertData[0].imageId;

    // Insert Category data in to ImageCategory
    categories.forEach(async (name) => {
      // Get the category id from the name
      const { data, error } = await client
        .from('ItemCategory')
        .select('id')
        .eq('name', name.toLowerCase());

      if (error) {
        return;
      }

      const { error: categoryError } = await client
        .from('ImageCategory')
        .insert({
          imageId: insertData[0].imageId,
          categoryId: data[0].id,
        });

      if (categoryError) {
        return;
      }
    });

    return responseData;
  }

  async getImagesByUserId(userImage: UserImageDTO): Promise<any> {
    const rows = await this.supa
      .getClient()
      .from('Image')
      .select('*')
      .eq('userId', userImage.userId);
    if (rows.error) {
      return { data: null, error: rows.error };
    }
    return { ...rows };
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
    return { data: row.data, error: row.error};
  }

  async deleteUserImage(imageId: string): Promise<any> {
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

  //   async searchImageByKeyWord(keyword: string, userId): Promise<Array<Image>> {
  //     try {
  //       let searchResult = new Array<Image>();

  //       const allUserimages = await this.getImagesByUserId(userId);

  //       for (const image of allUserimages) {
  //         // Check if any category name matches the keyword
  //         let hasKeyword = false;
  //         for (const cat of image.categories) {
  //           if (cat.name.toLocaleLowerCase().includes(keyword.toLowerCase())) {
  //             hasKeyword = true;
  //             break;
  //           }
  //         }
  //         if (hasKeyword) {
  //           searchResult.push(image);
  //         }
  //       }
  //       return searchResult;
  //     } catch (error) {
  //       console.error('Error finding images by keyword:', error);
  //       throw new Error('Error finding images by keyword');
  //     }
  //   }

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
}
