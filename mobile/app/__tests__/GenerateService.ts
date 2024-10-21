import axios from 'axios';

const API_Generate = "https://cloudcloset.kolide.co.nz/api/genOutfit";

export class GenerateService {
  private selectedCategories: any[];

  constructor() {
    this.selectedCategories = []; 
  }

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
  public setSelectedCategories(categories: any[]) {
    this.selectedCategories = categories;
  }
}
