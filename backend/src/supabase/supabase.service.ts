import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseProvider {
  private client: SupabaseClient;
  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SERVICE_ROLE_KEY,
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
