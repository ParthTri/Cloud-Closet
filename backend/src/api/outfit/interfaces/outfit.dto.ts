import { OutfitCategory } from "../outfitCategory/interfaces/outfitCategory.dto";

export interface Outfit {
    Id: string;
    name: string;
    userID: string;
    categories: OutfitCategory[];
    images: OutfitImage[]; 
  }

  export interface OutfitImage{
    imageId: string;
    proccessedUrl: string;
  }
  