import { Test } from '@nestjs/testing';
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

      const output: any = {
        data: {
          location: 'Auckland',
        },
        error: null,
      };

      const spy = jest
        .spyOn(weatherService, 'getWeatherData')
        .mockResolvedValue(output);

      const result = await weatherController.getLocalWeather(input);

      console.log(result);

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);

      // Expect the result of the mock test to contain the correct location
      expect(result).toEqual(
        expect.objectContaining({
          data: {
            location: 'Auckland',
          },
          error: null,
        }),
      );
    });
  });
});
