import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from 'src/schemas/favorite.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(userId: string) {
    return this.favoriteModel
      .find({
        user_id: userId,
      })
      .populate('product_id')
      .exec();
  }

  async add(userId: string, productId: string) {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const favorite = new this.favoriteModel({
      user_id: userId,
      product_id: productId,
    });

    return favorite.save();
  }

  async remove(userId: string, productId: string) {
    const deletedFavorite = await this.favoriteModel
      .findOneAndDelete({
        user_id: userId,
        product_id: productId,
      })
      .exec();

    if (!deletedFavorite) {
      throw new NotFoundException('Product is not in favorites');
    }

    return {
      message: 'Product removed from favorites',
    };
  }
}
