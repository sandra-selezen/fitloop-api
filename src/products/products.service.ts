import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

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

  findAll(): Promise<Product[] | null> {
    return this.productModel.find({});
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
