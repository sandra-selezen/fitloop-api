import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { ProductStatus } from '../types/product-status';

export class CreateProductDto {
  @ApiProperty({ example: 'FuelCell Rebel v5' })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'The FuelCell Rebel v5 was built to look and feel fast.',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 'shoes',
  })
  @IsString()
  category!: string;

  @ApiProperty({
    example: 'New Balance',
  })
  @IsString()
  brand!: string;

  @ApiProperty({
    example: 'new',
  })
  @IsString()
  product_type!: string;

  @ApiProperty({
    example: 'new_with_tags',
  })
  @IsString()
  condition!: string;

  @ApiProperty({
    example: 'pink',
  })
  @IsString()
  color!: string;

  @ApiProperty({
    example: 'women',
  })
  @IsString()
  gender!: string;

  @ApiProperty({
    example: '140000',
  })
  @IsInt()
  @IsPositive()
  price!: number;

  @ApiProperty({
    example: 'Tallinn, Estonia',
  })
  @IsString()
  location!: string;

  @ApiProperty({
    example: '38',
  })
  @IsString()
  size!: string;

  @ApiProperty({
    example: 'fuelcell-rebel-v5-3f8e68ee',
  })
  @IsString()
  slug!: string;

  @ApiProperty({
    example: [
      {
        url: 'https://res.cloudinary.com/a0onp82j/image/upload/v1787584660/fitloop/products/sjvfqvif1hckger9s2pu.jpg',
        publicId: 'fitloop/products/sjvfqvif1hckger9s2pu',
      },
    ],
  })
  @IsArray()
  images!: {
    url: string;
    publicId: string;
  }[];

  @ApiProperty({
    example: 'active',
  })
  @IsEnum(ProductStatus)
  status!: ProductStatus;
}
