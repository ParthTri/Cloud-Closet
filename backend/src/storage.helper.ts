import { Injectable } from '@nestjs/common';
const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING =
  process.env['STORAGE_CONNECTION_STRING'];

// Create the BlobServiceClient object with connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING,
);

@Injectable()
export class StorageHelper {
  async uploadImage(
    image: string | Blob | Buffer,
    containerName: string,
    blobName: string,
  ): Promise<string> {
    // Get a block blob client
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Create blobOptions
    var fileType = blobName.split('.')[1];
    if (fileType == 'jpg') {
      fileType = 'jpeg;';
    }
    const blobOptions = {
      blobHTTPHeaders: { blobContentType: `image/${fileType}` },
    };

    // Upload data to the blob
    if (image instanceof Blob) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await blockBlobClient.uploadData(buffer, blobOptions);
    } else {
      await blockBlobClient.upload(image, image.length);
    }

    return blockBlobClient.url;
  }

  async deleteImage(imageName, containerName) {
    // Get a block blob client
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    await blockBlobClient.delete();
  }
}
