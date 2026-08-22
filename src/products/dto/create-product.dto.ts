import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { ProductStatus } from '../types/product-status';

export class CreateProductDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsString()
  brand!: string;

  @IsString()
  productType!: string;

  @IsString()
  condition!: string;

  @IsString()
  color!: string;

  @IsString()
  gender!: string;

  @IsInt()
  @IsPositive()
  price!: number;

  @IsString()
  location!: string;

  @IsString()
  size!: string;

  @IsString()
  slug!: string;

  @IsEnum(ProductStatus)
  status!: ProductStatus;
}
