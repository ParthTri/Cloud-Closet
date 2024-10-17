export interface ImageInterface {
	imageId: string;
	processedUrl: string;
	categories: Category[];
}

export interface Category {
	categoryId: number;
	name: string;
	metaCategoryName: string;
}
