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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductStatus } from './types/product-status';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';
import { FavoritesService } from 'src/favorites/favorites.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly favoritesService: FavoritesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedImages = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadImage(file)),
    );

    return uploadedImages.map((image) => ({
      url: image.secure_url,
      publicId: image.public_id,
    }));
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
    return this.favoritesService.add(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  removeFromFavorites(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.favoritesService.remove(req.user.sub, id);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}
