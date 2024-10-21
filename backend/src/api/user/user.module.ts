import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SupabaseModule } from '../../supabase/supabase.module';
// import { User } from './user.entity';

@Module({
  imports: [SupabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
