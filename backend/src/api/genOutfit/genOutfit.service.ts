import { Injectable, Inject } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { GenOutfitDTO, OutfitType } from './interface/genOutfit.dto';
import { SupabaseProvider } from 'src/supabase/supabase.service';

@Injectable()
export class GenOutfitService {
  constructor(
    private weatherService: WeatherService,
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
  ) {}

  async generateOutft(req: GenOutfitDTO) {
    // const weatherInfo = await this.weatherService.getWeatherData({
    //   latitude: req.latitude,
    //   longitude: req.longitude,
    // });

    const weatherInfo = {
      data: {
        temperature: 18,
      },
    };

    // Set the search tag
    const searchTag = weatherInfo.data.temperature <= 16 ? 'cool' : 'warm';

    // Check if temperature is below 16 degrees C
    // If so -> look for item tags that are cool
    // else hot
    const outfit = [];

    const { data, error } = await this.supa
      .getClient()
      .from('Image')
      .select(
        `
        imageId,
        userId,
        processedUrl,
        ImageCategory (
          imageId,
          categoryId,
          ItemCategory (
            name
          )
        )
        `,
      )
      .eq('userId', req.userId);

    if (error) {
      return error;
    }

    // Filtering responses to match the search tag in the image category
    data.forEach((val) => {
      val.ImageCategory.forEach((imageCat) => {
        if (imageCat.ItemCategory['name'] == searchTag) {
          // console.log(imageCat);
          outfit.push(val);
        }
      });
    });

    const payload = [];
    let TOP = false;
    let BOTTOMS = false;
    let JACKET = false;
    // let DRESS = false;
    outfit.forEach((item) => {
      if (item['ImageCategory'].length > 1) {
        item['ImageCategory'].forEach((cat) => {
          const name: string = cat['ItemCategory']['name'];
          if (req.type == OutfitType.FORMAL) {
            if (!TOP && name == 'shirt') {
              payload.push(item);
              TOP = true;
            } else if (!BOTTOMS && name == 'pants') {
              payload.push(item);
              BOTTOMS = true;
            } else if (!JACKET && name == 'cardigan') {
              payload.push(item);
              JACKET = true;
            }
          } else {
            if (!TOP && name == 't-shirt') {
              payload.push(item);
              TOP = true;
            } else if (!BOTTOMS && (name == 'pants' || name == 'shorts')) {
              payload.push(item);
              BOTTOMS = true;
            } else if (!JACKET && name == 'down jacket') {
              payload.push(item);
              JACKET = true;
            }
          }
        });
      }
    });

    return payload;
  }
}
