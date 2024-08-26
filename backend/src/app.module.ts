import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'CloudClosetDB',
      autoLoadEntities: true,
    }),
    ApiModule,
  ],
  controllers: [AppController, ClosetController],
  providers: [
    AppService,
    DatabaseHelper,
    CategoryService,
    StorageHelper,
    ImageService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
