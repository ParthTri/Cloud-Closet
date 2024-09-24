import { Injectable } from '@nestjs/common';
import { StorageHelper } from '../../storage.helper';
import { DatabaseHelper } from '../../database.helper';
import { removeBackground } from '@imgly/background-removal-node';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

const USER_UPLOAD_CONTAINER = 'upload';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class ImageService {
  constructor(
    private readonly storageHelper: StorageHelper,
    private readonly databaseHelper: DatabaseHelper,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(Category)
    private categoryRepository : Repository<Category>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async uploadUserImage(
    image: any,
    fileName: string,
    categoryIds: Array<number>,
    userID: string,
  ): Promise<number> {
    // Upload user image
    let blobName = `raw-${uuidv1()}.${fileName.split('.')[1]}`;
    console.log("Raw blob name" + blobName);
    const imageUrl = await this.storageHelper.uploadImage(
      image,
      USER_UPLOAD_CONTAINER,
      blobName,
    );
    console.log(`Raw image url: ${imageUrl}`);
    console.log(categoryIds);

    // Remove background and upload
    const blob = await removeBackground(imageUrl);
    blobName = `processed-${uuidv1()}.png`;
    console.log(blobName);
    const processedUrl = await this.storageHelper.uploadImage(
      blob,
      USER_UPLOAD_CONTAINER,
      blobName,
    );

    // Insert to Photo database
    const newImage: Image = new Image();
    newImage.processedUrl = processedUrl;
    newImage.rawUrl = imageUrl;

    const user = await this.userRepository.findOneBy({ userID: userID });
    newImage.user = user;
    const out = await this.imageRepository.save(newImage);

  // Insert categories
  // Convert the array of numbers to an array of BigInt for comparison
  const bigIntCategoriesId = categoryIds.map(cat => BigInt(cat));
    

    //TODO: Insert to ImageCategory database
          for(const element of categoryIds)
      {
        const insertImageCategoryCommand = `INSERT INTO [dbo].[ImageCategory]
        ([ImageId]
        ,[CategoryId])
  VALUES
        (${out.imageID}
        ,${element})`;

      this.databaseHelper.queryDatabase(insertImageCategoryCommand);
      }    
    
    return out.imageID;
  }

  async deleteUserImage(image: number) {
    const targetImage = await this.imageRepository.findOneBy({
      imageID: image,
    });

    // Get the image names from the ID
    let rawImage = targetImage.rawUrl;
    const rawImageData = rawImage.split('/');

    let processedImage = targetImage.processedUrl;
    const processedImageData = processedImage.split('/');

    processedImage = processedImageData.pop();
    rawImage = rawImageData.pop();

    try {
      await this.storageHelper.deleteImage(
        processedImage,
        USER_UPLOAD_CONTAINER,
      );
      await this.storageHelper.deleteImage(rawImage, USER_UPLOAD_CONTAINER);
      await this.imageRepository.delete({ imageID: image });
    } catch (e) {
      throw e;
    }
  }

  async getImagesByUserId(userId): Promise<Image[]> {
    const foundUser: User = await this.userRepository.findOneBy({
      userID: userId,
    });
    const foundImages: Image[] = await this.imageRepository.find({
      where: { user: foundUser },
      relations: ['categories'],
    });

    return foundImages;
  }
  
  async searchImageByKeyWord(keyword: string, userId): Promise<Array<Image>> {
    try {
        let searchResult = new Array<Image>();

        const allUserimages = await this.getImagesByUserId(userId);

        for (const image of allUserimages) {
            // Check if any category name matches the keyword
            let hasKeyword = false;
            for (const cat of image.categories) {
                if (cat.name.toLocaleLowerCase().includes(keyword.toLowerCase())) {
                    hasKeyword = true;
                    break;
                }
            }
            if (hasKeyword) {
                searchResult.push(image);
            }
        }
        return searchResult;
    } catch (error) {
        console.error("Error finding images by keyword:", error);
        throw new Error("Error finding images by keyword");
    }
}

async filterImageByCategory(categories: Array<number>, userId): Promise<Array<Image>> {
  let filterResult = new Array<Image>();

  const allUserimages = await this.getImagesByUserId(userId);

  console.log(allUserimages);

  // Convert the array of numbers to an array of BigInt for comparison
  const bigIntCategories = categories.map(cat => BigInt(cat));

  // Iterate over all user images
  for (const image of allUserimages) {
      // Check if any category id of the image matches the provided categories
      let hasCategory = false;
      for (const cat of image.categories) {
          if (categories.includes(Number(cat.categoryID))) {
              hasCategory = true;
              break;
          }
      }
      if (hasCategory) {
          filterResult.push(image);
      }
  }
  return filterResult;
}

}
