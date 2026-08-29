import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    type: String,
    min: 1,
    default: null,
  })
  name?: string | null;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    type: String,
    required: true,
    min: 8,
    select: false,
  })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
