import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { WeatherModule } from './weather/weather.module';
import { CategoryModule } from './category/category.module';
import { OutfitCategoryModule } from './outfitCategory/outfitCategory.module';
import {OutfitModule} from './outfit/outfit.module';
import { SharedModule } from './sharedModule';

@Module({
  imports: [SharedModule, UserModule, ImageModule, CategoryModule, WeatherModule, OutfitCategoryModule, OutfitModule],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
