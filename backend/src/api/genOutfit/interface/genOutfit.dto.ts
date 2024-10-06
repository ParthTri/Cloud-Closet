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
