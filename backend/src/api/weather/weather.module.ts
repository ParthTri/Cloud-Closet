import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controlller';
import { WeatherService } from './weather.service';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
