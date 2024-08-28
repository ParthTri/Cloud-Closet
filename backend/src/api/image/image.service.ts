import { Injectable } from '@nestjs/common';
import { StorageHelper } from "../../storage.helper";
import { DatabaseHelper } from '../../database.helper';
import { removeBackground } from "@imgly/background-removal-node";
import { UserImage, UserImageCategory } from './userimage';

const USER_UPLOAD_CONTAINER = "upload";
const { v1: uuidv1 } = require("uuid");

@Injectable()
export class ImageService {
    constructor(private readonly storageHelper: StorageHelper,
        private readonly databaseHelper: DatabaseHelper
    ) { }

    async uploadUserImage(userId, image, fileName, categories: Array<number>) {
        // Upload user image
        const blobName = `raw-${uuidv1()}.${fileName.split('.')[1]}`;
        const imageUrl = await this.storageHelper.uploadImage(image, USER_UPLOAD_CONTAINER, blobName);
        console.log(`Raw image url: ${imageUrl}`);

        // Remove background and upload
        removeBackground(imageUrl).then(async (processedImage: Blob) => {
            const blobName = `processed-${uuidv1()}.png`;
            const processedUrl = await this.storageHelper.uploadImage(processedImage, USER_UPLOAD_CONTAINER, blobName);

            // Insert to Photo database
            const insertImageCommand = `INSERT INTO [dbo].[Image]
                                ([userId]
                                ,[rawUrl]
                                ,[processedUrl]
                                ,[createdDate])
                                VALUES
                                ('${userId}'
                                ,'${imageUrl}'
                                ,'${processedUrl}'
                                , GETDATE());
                                SELECT SCOPE_IDENTITY() AS Id;`;

            const newImage = await this.databaseHelper.queryDatabase(insertImageCommand);

            // Insert to ImageCategory database
            categories.forEach(element => {
                const insertImageCategoryCommand = `INSERT INTO [dbo].[ImageCategory]
                ([imageId]
                ,[categoryId])
          VALUES
                (${newImage[0].Id}
                ,${element})`;

                this.databaseHelper.queryDatabase(insertImageCategoryCommand);

            });
        });
    }

    async deleteImage(imageIDs) {
        if (imageIDs.length == 0) {
            console.log("Null ids");
            return;
        }

        try {
            // Initialize arrays with TypeScript type annotations
            const rawUrls: string[] = [];
            const processedUrls: string[] = [];

            // Iterate over imageIDs to get raw and processed Urls
            for (const id of imageIDs) {
                const query = `SELECT [rawUrl],[processedUrl]
                FROM [dbo].[Image]
                WHERE imageID = '${id}'`;

                const result = await this.databaseHelper.queryDatabase(query);
                
                rawUrls.push(result[0].rawUrl);
                processedUrls.push(result[0].processedUrl);
            }
            
            // Delete images in database
            for (const id of imageIDs) {
                const query = `DELETE FROM [dbo].[ImageCategory]
                            WHERE imageID = '${id}';
                            DELETE FROM [dbo].[Image]
                            WHERE imageID = '${id}'`;

                const resultdab = this.databaseHelper.queryDatabase(query);

            }

            // Iterate over each image raw URL to delete in the storage
            for (const url of rawUrls) {
                this.storageHelper.deleteImage(url, USER_UPLOAD_CONTAINER)
            }

            // Iterate over each image processed URL to delete in the storage
            for (const url of processedUrls) {
                this.storageHelper.deleteImage(url, USER_UPLOAD_CONTAINER)
            }

        } catch (error) {
            console.error("Error deleting images", error);
            throw new Error("Error deleting images");
        }
    }

    async getImagesByUserId(user_id): Promise<Array<UserImage>> {
        try {
            const query = `SELECT *
        FROM [dbo].[Image]
        WHERE userID = '${user_id}'`;
            const result = await this.databaseHelper.queryDatabase(query);

            let images = new Array<UserImage>();

            for (const element of result) {
                var image = new UserImage();
                image.Id = element.imageID;

                image.ProcessedUrl = element.processedUrl;
                images.push(image);

                const queryCategory = `select pc.ImageId, pc.CategoryId, c.Name
                                   from ImageCategory pc join Category c on pc.CategoryId = c.categoryId
                                   where pc.ImageId = ${image.Id}`;
                const categoryResult = await this.databaseHelper.queryDatabase(queryCategory);

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

        } catch (error) {
            console.error("Error retrieving images by user ID:", error);
            throw new Error("Error retrieving images by user ID");
        }
    }

    async searchImageByKeyWord(keyword: string, userId): Promise<Array<UserImage>> {
        try {
            let searchResult = new Array<UserImage>();

            const allUserimages = await this.getImagesByUserId(userId);

            for (const image of allUserimages) {
                // Check if any category name matches the keyword
                let hasKeyword = false;
                for (const cat of image.Categories) {
                    if (cat.Name.toLocaleLowerCase().includes(keyword.toLowerCase())) {
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

    async filterImageByCategory(categories: Array<number>, userId): Promise<Array<UserImage>> {
        let filterResult = new Array<UserImage>();

        const allUserimages = await this.getImagesByUserId(userId);

        for (const image of allUserimages) {
            // Check if any category id matches
            let hasCategory = false;
            for (const cat of image.Categories) {
                if (categories.includes(cat.Id)) {
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