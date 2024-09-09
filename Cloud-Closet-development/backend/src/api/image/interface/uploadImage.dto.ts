export interface UploadImage {
  image?: Express.Multer.File;
  fileName: string;
  categories: number[];
  userID: string;
}
