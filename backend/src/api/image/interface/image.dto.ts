import { CategoryDTO } from "src/api/category/interfaces/category.dto";

export interface ImageDTO {
imageId: string;
created_at: string;
rawUrl: string;
processedUrl: string;
userId: string;
categories: CategoryDTO[]
}

