// src/services/GenerateService.ts

import axios from 'axios';

// Define the API endpoint
const API_Generate = "https://cloudcloset.kolide.co.nz/api/genOutfit";

// Main service class
export class GenerateService {
  private selectedCategories: any[];

  constructor() {
    this.selectedCategories = [];  // Initialize selectedCategories
  }

  /**
   * Fetch the generated outfit images from the API.
   * @param userId The user ID.
   * @param longitude User's current longitude.
   * @param latitude User's current latitude.
   * @param type Category type to fetch.
   * @returns Array of generated images or an empty array if failed.
   */
  
  public async fetchGenerate(
    userId: string | undefined,
    longitude: number,
    latitude: number,
    type: number
  ): Promise<{ imageUrl: string; categories: string }[]> {
    try {
      if (!userId) {
        console.error("User ID is not provided.");
        return [];
      }

      const selectedType =
        this.selectedCategories.length > 0 ? this.selectedCategories[0] : type;

      console.log("Sending request to generate outfit with data:", {
        userId,
        longitude,
        latitude,
        type: selectedType,
      });

      const response = await axios.post(API_Generate, {
        userId,
        longitude,
        latitude,
        type: selectedType,
      });

      console.log("API response:", response.data);

      if (response.data && response.data.data.length > 0) {
        const generatedImages = response.data.data.map(
          (item: { processedUrl: string; imageCategory: any[] }) => ({
            imageUrl: item.processedUrl,
            categories: item.imageCategory
              .map((cat) => cat.categoryName)
              .join(", "),
          })
        );

        return generatedImages;
      } else {
        console.error("No images returned from the API.");
        return [];
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Error:", error);
      }
      return [];
    }
  }

  // Setter for selected categories
  public setSelectedCategories(categories: any[]) {
    this.selectedCategories = categories;
  }
}
