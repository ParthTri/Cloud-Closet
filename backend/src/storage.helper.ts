import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';

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
    let fileType = blobName.split('.')[1];
    if (fileType == 'jpg') {
      fileType = 'jpeg;';
    }
    console.log("File type: " + fileType);
    const blobOptions = {
      blobHTTPHeaders: { blobContentType: `image/${fileType}` },
    };

    // Upload data to the blob
    if (image instanceof Blob) {
      console.log("Image is a Blob");
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await blockBlobClient.uploadData(buffer, blobOptions);
    } else if (image instanceof Buffer) {
      console.log("Image is a Buffer string");
      await blockBlobClient.uploadData(image, blobOptions);
    } else {
      console.log("Image is a base64 string");
      let matchesBlobImg = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let imgBuffer = Buffer.from(matchesBlobImg[2], 'base64');
      await blockBlobClient.uploadData(imgBuffer, blobOptions);
    }
    return blockBlobClient.url;
  }

  // private extractBlobNameFromUrl(url: string): string {
  //   // Create a URL object to parse the URL
  //   const urlParts = new URL(url).pathname.split('/');

  //   // The last part of the path is the blob name
  //   return urlParts[urlParts.length - 1];
  // }

  async deleteImage(url, containerName) {
    try {
      // Get a reference to the container client
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Extract the blob name from the URL
      const blobName = url;

      // Get a reference to the blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Delete the blob
      await blockBlobClient.delete();
      console.log(`Blob ${blobName} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting blob', error);
      throw new Error('Error deleting blob from Azure Blob Storage');
    }
  }
}
