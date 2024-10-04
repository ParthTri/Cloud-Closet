import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { WeatherModule } from './weather/weather.module';
import { CategoryModule } from './category/category.module';
import { GenOutfitModule } from './genOutfit/genOutfit.module';

@Module({
  imports: [
    UserModule,
    ImageModule,
    CategoryModule,
    WeatherModule,
    GenOutfitModule,
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
