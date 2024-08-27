import { Injectable } from '@nestjs/common';
import { StorageHelper } from '../../storage.helper';
import { DatabaseHelper } from '../../database.helper';
import { removeBackground } from '@imgly/background-removal-node';
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
}
