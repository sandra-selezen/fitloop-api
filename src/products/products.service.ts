import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/schemas/product.schema';
import { ProductStatus } from './types/product-status';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  findAllActiveProducts(): Promise<Product[] | null> {
    return this.productModel.find({ status: ProductStatus.ACTIVE });
  }

  async create(
    createProductDto: CreateProductDto,
    sellerId: string,
  ): Promise<Product> {
    const product = await this.productModel.create({
      ...createProductDto,
      seller_id: sellerId,
    });

    return product;
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  async findAllMyProducts(sellerId: string, status?: ProductStatus) {
    const filter: {
      seller_id: string;
      status?: ProductStatus;
    } = {
      seller_id: sellerId,
    };

    if (status) {
      filter.status = status;
    }

    return this.productModel.find(filter).exec();
  }

  async update(
    id: string,
    sellerId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productModel.findOne({
      _id: id,
      seller_id: sellerId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
