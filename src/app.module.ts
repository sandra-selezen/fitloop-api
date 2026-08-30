import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FavoritesController } from './favorites/favorites.controller';
import { FavoritesModule } from './favorites/favorites.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SalesModule } from './sales/sales.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ProductsModule,
    AuthModule,
    UsersModule,
    FavoritesModule,
    CloudinaryModule,
    SalesModule,
    OrdersModule,
  ],
  controllers: [AppController, FavoritesController],
  providers: [AppService],
})
export class AppModule {}
