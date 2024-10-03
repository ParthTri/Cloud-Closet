import { Injectable } from '@nestjs/common';
import { GetWeatherDTO, WeatherDTO } from './interface/weather.dto';
import axios from 'axios';
const URL_BUILDER = (lat: number, long: number): string =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.OPEN_WEATHER_MAP}`;

@Injectable()
export class WeatherService {
  constructor() {}

  async getWeatherData(locationData: GetWeatherDTO): Promise<any> {
    let data: WeatherDTO;

    try {
      const responses = await axios.get(
        URL_BUILDER(locationData.latitude, locationData.longitude),
      );

      console.log(responses.data);

      data = {
        weather: responses.data['weather'][0]['main'],
        temperature: responses.data['main']['temp'],
        location: responses.data['name'],
      };
    } catch (error) {
      console.log(error);
      return { data: null, error: error };
    }

    return { data: data, error: null };
  }
}
