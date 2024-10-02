import { Injectable } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';

@Injectable()
export class CategoryService {
  constructor(private readonly supa: SupabaseProvider) {}

  async getAllCategories(): Promise<any> {
    const { data } = await this.supa
      .getClient()
      .from('ItemCategory')
      .select('*');
    return data;
  }

  //   async getCategoryById(id: bigint): Promise<Category> {
  //     return await this.categoryRepository.findOneBy({ categoryID: id });
  //   }

  //   async getUserCategory(id: string): Promise<Category[]> {
  //     return await this.categoryRepository
  //       .createQueryBuilder()
  //       .where('userID = :userId', { userId: id })
  //       .execute();
  //   }
}
