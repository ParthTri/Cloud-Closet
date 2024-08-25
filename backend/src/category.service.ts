import { Injectable } from '@nestjs/common';
import { DatabaseHelper } from "./database.helper";

@Injectable()
export class CategoryService {
    constructor(private readonly databaseHelper: DatabaseHelper) {}

    async getAllCategories(): Promise<string> {
        const query = "select * from tags;";
        const result = this.databaseHelper.queryDatabase(query);

        return result;
    }

    async getCategoryById(id: bigint): Promise<string> {
        const query = `select * from tags where id = ${id};`;
        const result = this.databaseHelper.queryDatabase(query);

        return result;
    }
}