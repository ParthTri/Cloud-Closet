import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
// import { CategoryModule } from './category/category.module';
// import { ImageModule } from './image/image.module';

@Module({
  // imports: [UserModule, CategoryModule, ImageModule],
  imports: [UserModule],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
