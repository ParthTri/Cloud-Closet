import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ApiModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor() {}
}
