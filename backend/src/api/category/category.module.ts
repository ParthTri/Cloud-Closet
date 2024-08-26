import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { DatabaseHelper } from 'src/database.helper';
import { CategoryService } from './category.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [DatabaseHelper, CategoryService],

})
export class CategoryModule {}
