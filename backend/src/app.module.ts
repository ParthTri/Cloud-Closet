import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ApiModule],
  imports: [
    ConfigModule.forRoot(),
  controllers: [AppController, ClosetController],
  providers: [
    AppService,
    DatabaseHelper,
    CategoryService,
    StorageHelper,
    ImageService,
  ],
})
export class AppModule {}
