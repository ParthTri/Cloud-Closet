import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { DatabaseHelper } from 'src/database.helper';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [CategoryController],
  providers: [DatabaseHelper, CategoryService],
})
export class CategoryModule {}
