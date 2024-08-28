import { Injectable } from '@nestjs/common';
import { DatabaseHelper } from "../../database.helper";

@Injectable()
export class CategoryService {
    constructor(private readonly databaseHelper: DatabaseHelper) {}

    async getAllCategories(): Promise<string> {
        const query = "select * from category;";
        const result = this.databaseHelper.queryDatabase(query);

        return result;
    }

    async getCategoryById(id: number): Promise<string> {
        const query = `select * from category where categoryId = ${id};`;
        const result = this.databaseHelper.queryDatabase(query);

        return result;
    }
}