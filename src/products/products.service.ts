import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { ProductStatus } from './types/product-status';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetProductsDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: GetProductsDto) {
    const {
      search,
      category,
      product_type,
      size,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = query;

    const filter: QueryFilter<Product> = {
      status: ProductStatus.ACTIVE,
    };

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          brand: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (product_type) {
      filter.product_type = product_type;
    }

    if (size) {
      filter.size = size;
    }

    let sortOption: Record<string, 1 | -1>;

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      products,
      meta_data: {
        page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
      },
    };
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

    if (updateProductDto.images) {
      const oldImages = product.images ?? [];
      const newImages = updateProductDto.images;

      const newPublicIds = new Set(newImages.map((image) => image.publicId));

      const removedImages = oldImages.filter(
        (image) => !newPublicIds.has(image.publicId),
      );

      for (const image of removedImages) {
        await this.cloudinaryService.deleteImage(image.publicId);
      }
    }

    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async remove(id: string, sellerId: string) {
    const product = await this.productModel.findOne({
      _id: id,
      seller_id: sellerId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    for (const image of product.images ?? []) {
      await this.cloudinaryService.deleteImage(image.publicId);
    }

    await this.productModel.findByIdAndDelete(id);

    return {
      message: 'Product deleted successfully',
    };
  }
}
