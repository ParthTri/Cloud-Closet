export interface FileUploadDTO {
  rawData: {
    id: string;
    path: string;
    fullPath: string;
  };
  processedData: {
    id: string;
    path: string;
    fullPath: string;
  };
  rawUrl: string;
  processedUrl: string;
  imageId: string;
}

export interface FileUploadErrorDTO {
  data?: any;
  error: any;
}
