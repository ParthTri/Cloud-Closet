import { Injectable } from '@nestjs/common';
import { StorageHelper } from '../../storage.helper';
import { DatabaseHelper } from '../../database.helper';
import { removeBackground } from '@imgly/background-removal-node';
import { UserImage, UserImageCategory } from './userimage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { User } from '../user/user.entity';

const USER_UPLOAD_CONTAINER = 'upload';
const { v1: uuidv1 } = require('uuid');

@Injectable()
export class ImageService {
  constructor(
    private readonly storageHelper: StorageHelper,
    private readonly databaseHelper: DatabaseHelper,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async uploadUserImage(
    image: Buffer,
    fileName: string,
    categories: Array<bigint>,
    userID: string,
  ): Promise<number> {
    // Upload user image
    let blobName = `raw-${uuidv1()}.${fileName.split('.')[1]}`;
    const imageUrl = await this.storageHelper.uploadImage(
      image,
      USER_UPLOAD_CONTAINER,
      blobName,
    );
    console.log(`Raw image url: ${imageUrl}`);

    // Remove background and upload
    const blob = await removeBackground(imageUrl);
    blobName = `processed-${uuidv1()}.png`;
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

    // TODO: Insert to ImageCategory database
    // categories.forEach((element) => {
    //   const insertImageCategoryCommand = `INSERT INTO [dbo].[ImageCategory]
    //           ([ImageId]
    //           ,[CategoryId])
    //     VALUES
    //           (${newImage[0].Id}
    //           ,${element})`;

    //   this.databaseHelper.queryDatabase(insertImageCategoryCommand);
    // });

    return out.imageID;
  }

  async deleteUserImage(image) {
    this.storageHelper.deleteImage(image, USER_UPLOAD_CONTAINER);
  }

  async getImagesByUserId(userId): Promise<Array<UserImage>> {
    const query = `SELECT *
        FROM [dbo].[Image]
        WHERE user_id = '${userId}'`;
    const result = await this.databaseHelper.queryDatabase(query);
    let images = new Array<UserImage>();

    await result.forEach(async (element) => {});

    for (const element of result) {
      var image = new UserImage();
      image.Id = element.Id;
      image.ProcessedUrl = element.ProcessedUrl;
      images.push(image);

      const queryCategory = `select pc.ImageId, pc.CategoryId, c.Name
                                   from ImageCategory pc join Category c on pc.CategoryId = c.Id
                                   where pc.ImageId = ${image.Id}`;
      const categoryResult =
        await this.databaseHelper.queryDatabase(queryCategory);

      var categories = new Array<UserImageCategory>();
      for (const el of categoryResult) {
        var category = new UserImageCategory();
        category.Id = el.CategoryId;
        category.Name = el.Name;

        categories.push(category);
      }

      image.Categories = categories;
    }

    return images;
  }
}
