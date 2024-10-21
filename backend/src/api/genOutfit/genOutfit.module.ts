import { Module } from '@nestjs/common';
import { GenOutfitController } from './genOutfit.controller';
import { GenOutfitService } from './genOutfit.service';
import { WeatherModule } from '../weather/weather.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [WeatherModule, SupabaseModule],
  controllers: [GenOutfitController],
  providers: [GenOutfitService],
})
export class GenOutfitModule {}
