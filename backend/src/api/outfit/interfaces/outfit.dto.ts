import { OutfitCategory } from "../../outfitCategory/interfaces/outfitCategory.dto";
import { ImageDTO } from "src/api/image/interface/image.dto";

export interface Outfit {
    Id: string;
    created_at: string;
    name: string;
    userID: string;
    categories: OutfitCategory[];
    images: ImageDTO[]; 
  }

  // export interface OutfitImage{
  //   imageId: string;
  //   proccessedUrl: string;
  // }
  