// import { Injectable } from '@nestjs/common';
// import { DatabaseHelper } from '../../database.helper';
// import { Category } from './category.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// @Injectable()
// export class CategoryService {
//   constructor(
//     private readonly databaseHelper: DatabaseHelper,

//     @InjectRepository(Category)
//     private categoryRepository: Repository<Category>,
//   ) {}

//   async getAllCategories(): Promise<Category[]> {
//     const x = await this.categoryRepository.find();
//     return x;
//   }

//   async getCategoryById(id: bigint): Promise<Category> {
//     return await this.categoryRepository.findOneBy({ categoryID: id });
//   }

//   async getUserCategory(id: string): Promise<Category[]> {
//     return await this.categoryRepository
//       .createQueryBuilder()
//       .where('userID = :userId', { userId: id })
//       .execute();
//   }
// }
