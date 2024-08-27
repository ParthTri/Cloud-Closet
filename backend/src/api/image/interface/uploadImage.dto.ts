export interface UploadImage {
  image?: Express.Multer.File;
  fileName: string;
  categories: bigint[];
  userID: string;
}
