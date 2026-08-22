import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { ProductStatus } from 'src/products/types/product-status';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({
    type: String,
    min: 1,
    default: '',
  })
  title!: string;

  @Prop({
    type: String,
    min: 4,
    default: '',
  })
  description!: string;

  @Prop({
    type: String,
    default: '',
  })
  category!: string;

  @Prop({
    type: String,
    default: '',
  })
  brand!: string;

  @Prop({
    type: String,
    default: '',
  })
  productType!: string;

  @Prop({
    type: String,
    default: '',
  })
  condition!: string;

  @Prop({
    type: String,
    default: '',
  })
  size!: string;

  @Prop({
    type: String,
    default: '',
  })
  color!: string;

  @Prop({
    type: String,
    default: '',
  })
  gender!: string;

  @Prop({
    type: Number,
    default: 1,
  })
  price!: number;

  @Prop({
    type: String,
    min: 2,
    default: '',
  })
  location!: string;

  @Prop({
    type: String,
    min: 8,
    default: '',
  })
  slug!: string;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status!: ProductStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  seller_id!: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
