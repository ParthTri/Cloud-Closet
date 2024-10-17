export interface ImageInterface {
	imageId: string;
	processedUrl: string;
	categories: Category[];
}

export interface Category {
	categoryId: string;
	name: string;
	metaCateogryName: string;
}
