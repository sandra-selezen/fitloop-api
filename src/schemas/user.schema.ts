import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @Prop({
    type: String,
    min: 1,
    default: null,
  })
  name?: string | null;

  @ApiProperty({
    example: 'john.doe@mail.com',
    description: 'E-mail address',
  })
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
  })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
