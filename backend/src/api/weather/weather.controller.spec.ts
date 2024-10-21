import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { WeatherController } from './weather.controlller';
import { WeatherService } from './weather.service';
import { GetWeatherDTO } from './interface/weather.dto';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [WeatherService],
      imports: [ConfigModule.forRoot()],
    }).compile();

    weatherService = moduleRef.get(WeatherService);
    weatherController = moduleRef.get(WeatherController);
  });

  describe('getWeatherData', () => {
    it('Should return the correct location for coordinates provided', async () => {
      const input: GetWeatherDTO = {
        latitude: -36.848461,
        longitude: 174.763336,
        timezone: 'Pacific/Auckland',
      };

      const spy = jest.spyOn(weatherService, 'getWeatherData');

      const result = await weatherController.getLocalWeather(input);

      console.log(result);

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);

      // Expect the result of the mock test to contain the correct location
      expect(result.data.location).toEqual('Auckland');
    });
  });
});
