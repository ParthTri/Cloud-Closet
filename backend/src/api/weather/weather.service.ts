import { Inject, Injectable } from '@nestjs/common';
import { SupabaseProvider } from 'src/supabase/supabase.service';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
  ) {}
}
