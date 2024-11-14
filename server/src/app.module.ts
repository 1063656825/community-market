import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '199849',
      database: 'community_market',
      entities: [Product],
      synchronize: false,
      timezone: '+08:00',
      dateStrings: ['DATE'],
      extra: {
        connectionLimit: 10,
        charset: 'utf8mb4_unicode_ci',
        dateStrings: true,
        supportBigNumbers: true,
        bigNumberStrings: true,
      },
      legacySpatialSupport: false,
    }),
    ProductsModule,
    UploadModule,
  ],
})
export class AppModule {} 