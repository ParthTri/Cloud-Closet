import { Module } from '@nestjs/common';
import { SupabaseProvider } from './supabase.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SupabaseProvider],
  exports: [SupabaseProvider],
})
export class SupabaseModule {}
