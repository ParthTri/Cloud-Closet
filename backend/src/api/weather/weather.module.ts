import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controlller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { WeatherService } from './weather.service';

@Module({
  imports: [SupabaseModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
