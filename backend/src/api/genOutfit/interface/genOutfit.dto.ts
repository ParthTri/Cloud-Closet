export interface GenOutfitDTO {
  userId: string;
  longitude: number;
  latitude: number;
  type: OutfitType;
}

export enum OutfitType {
  FORMAL,
  CASUAL,
}

export interface GeneratedOutfitItem {
  imaegId: string;
  processedUrl: string;
  imageCategory: OutfitItemCategory[];
}

export interface OutfitItemCategory {
  categoryId: number;
  categoryName: string;
}
