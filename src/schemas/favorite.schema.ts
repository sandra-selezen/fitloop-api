import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({ timestamps: true, versionKey: false })
export class Favorite {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id!: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

FavoriteSchema.index({ user_id: 1, product_id: 1 }, { unique: true });
