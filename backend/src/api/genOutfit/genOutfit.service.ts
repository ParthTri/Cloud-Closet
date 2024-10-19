import { Injectable, Inject } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import {
  GeneratedOutfitItem,
  GenOutfitDTO,
  OutfitItemCategory,
  OutfitType,
  OutfitTypeName,
} from './interface/genOutfit.dto';
import { SupabaseProvider } from 'src/supabase/supabase.service';

@Injectable()
export class GenOutfitService {
  constructor(
    private weatherService: WeatherService,
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
  ) {}

  formatOutfitData(data: any[]): GeneratedOutfitItem[] {
    const outfitData: GeneratedOutfitItem[] = [];

    data.forEach((val) => {
      const itemData: GeneratedOutfitItem = {
        imaegId: val['imageId'],
        processedUrl: val['processedUrl'],
        imageCategory: [],
      };

      val['ImageCategory'].forEach((imageCat) => {
        const itemCat: OutfitItemCategory = {
          categoryId: imageCat['categoryId'],
          categoryName: imageCat['ItemCategory']['name'],
        };
        itemData.imageCategory.push(itemCat);
      });

      outfitData.push(itemData);
    });

    return outfitData;
  }

  async generateOutft(req: GenOutfitDTO) {
    let weatherInfo;
    try {
      weatherInfo = await this.weatherService.getWeatherData({
        latitude: req.latitude,
        longitude: req.longitude,
      });
    } catch (e) {
      return { data: null, error: e };
    }

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
            name,
            metaCategory
          )
        )
        `,
      )
      .eq('userId', req.userId);

    if (error) {
      return { data: null, error };
    }

    // Filtering responses to match the search tag in the image category
    data.forEach((val) => {
      val.ImageCategory.forEach((imageCat) => {
        if (
          imageCat.ItemCategory['name'] == searchTag ||
          imageCat.ItemCategory['name'] == 'neutral'
        ) {
          outfit.push(val);
        }
      });
    });

    console.log('formal' == OutfitTypeName[OutfitType[req.type]]);

    const filteredData = data.filter((val) => {
      if (val.ImageCategory.length == 0) {
        return false;
      }

      const ret = val.ImageCategory.filter(
        (x) =>
          x['ItemCategory']['name'] == OutfitTypeName[OutfitType[req.type]],
      );

      return ret.length > 0;
    });

    const payload = [];
    let TOP = false;
    let BOTTOMS = false;
    let JACKET = false;
    let FOOTWEAR = false;
    while (
      !(TOP && BOTTOMS && JACKET && FOOTWEAR) &&
      filteredData.length != 0
    ) {
      try {
        const index = Math.floor(Math.random() * filteredData.length);
        const item = filteredData[index];
        filteredData.splice(index, 1);
        if (item['ImageCategory'].length > 1) {
          item['ImageCategory'].forEach((cat) => {
            const meta: string = cat['ItemCategory']['metaCategory'];
            if (!TOP && meta == 'TOP') {
              payload.push(item);
              TOP = true;
            } else if (!BOTTOMS && meta == 'BOTTOM') {
              payload.push(item);
              BOTTOMS = true;
            } else if (!FOOTWEAR && meta == 'FOOTWEAR') {
              payload.push(item);
              FOOTWEAR = true;
            } else if (!JACKET && meta == 'JACKET') {
              payload.push(item);
              JACKET = true;
            }
          });
        }
      } catch (e) {
        continue;
      }
    }

    return { data: this.formatOutfitData(payload), error: null };
  }
}
