export interface GetWeatherDTO {
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherDTO {
  weather: string;
  temperature: string;
  location: string;
  error?: any;
}
