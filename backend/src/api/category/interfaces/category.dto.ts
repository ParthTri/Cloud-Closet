export interface CategoryDTO {
  categoryId?: number;
  name: string;
  metaCategory?: MetaCategory;
  metaCategoryName?: string;
}

export enum MetaCategory {
  JACKET,
  TOP,
  BOTTOM,
  FOOTWEAR,
}
export const MetaCategoryName = {
  JACKET: 'jacket',
  TOP: 'top',
  BOTTOM: 'bottom',
  FOOTWEAR: 'footwear',
};
