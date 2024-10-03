import { Controller, Body, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDTO } from './interface/weather.dto';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('')
  async getLocalWeather(@Body() locationData: GetWeatherDTO): Promise<any> {
    return await this.weatherService.getWeatherData(locationData);
  }
}
