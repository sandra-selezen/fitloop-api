import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';
import { User } from './user.schema';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ _id: true })
export class OrderItem {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id!: Types.ObjectId;

  @Prop({ required: true })
  product_title!: string;

  @Prop({ required: true })
  product_brand!: string;

  @Prop({ default: null })
  product_image!: string | null;

  @Prop({ default: null })
  product_size!: string | null;

  @Prop({ default: null })
  product_condition!: string | null;

  @Prop({ required: true, min: 0 })
  unit_price!: number;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  total_price!: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  seller_id!: Types.ObjectId;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({
    type: String,
    required: true,
  })
  buyer_id!: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Prop({
    type: String,
    required: true,
    default: 'pending',
  })
  payment_status!: string;

  @Prop({
    type: String,
    required: true,
  })
  delivery_method!: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  subtotal_amount!: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  shipping_amount!: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  total_amount!: number;

  @Prop({
    type: String,
    required: true,
  })
  first_name!: string;

  @Prop({
    type: String,
    required: true,
  })
  last_name!: string;

  @Prop({
    type: String,
    required: true,
  })
  customer_email!: string;

  @Prop({
    type: String,
    required: true,
  })
  city!: string;

  @Prop({
    type: String,
    required: true,
  })
  country!: string;

  @Prop({
    type: [OrderItemSchema],
    required: true,
    default: [],
  })
  order_items!: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
