import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductStatus } from './types/product-status';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAllActiveProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getProducts(
    @Request() req: AuthenticatedRequest,
    @Query('status') status?: ProductStatus,
  ) {
    return this.productsService.findAllMyProducts(req.user.sub, status);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, req.user.sub, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  addToFavorites(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    // return this.favoritesService.add(req.user.sub, id);
    return `this ${id} and ${req.user.sub}`;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  removeFromFavorites(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    // return this.favoritesService.remove(req.user.sub, id);
    return `this ${id} and ${req.user.sub}`;
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}
