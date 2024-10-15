import { ApiProperty } from '@nestjs/swagger';

export class GenOutfitDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  type: OutfitType;
}

export enum OutfitType {
  FORMAL,
  CASUAL,
}

export const OutfitTypeName = {
  FORMAL: 'formal',
  CASUAL: 'casual',
  DRESSY: 'dressy',
};

export interface GeneratedOutfitItem {
  imaegId: string;
  processedUrl: string;
  imageCategory: OutfitItemCategory[];
}

export interface OutfitItemCategory {
  categoryId: number;
  categoryName: string;
}
