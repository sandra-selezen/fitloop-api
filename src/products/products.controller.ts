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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductStatus } from './types/product-status';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';
import { FavoritesService } from 'src/favorites/favorites.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetProductsDto } from './dto/get-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly favoritesService: FavoritesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ summary: 'Get products' })
  @ApiResponse({ status: 200, type: CreateProductDto, isArray: true })
  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: CreateProductDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my products by status' })
  @ApiResponse({ status: 200, type: CreateProductDto, isArray: true })
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

  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, type: CreateProductDto })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, req.user.sub, updateProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product to favorite' })
  @ApiResponse({ status: 200, description: 'Product added to favorite' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  addToFavorites(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.favoritesService.add(req.user.sub, id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product from favorite' })
  @ApiResponse({ status: 200, description: 'Product removed from favorite' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  removeFromFavorites(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.favoritesService.remove(req.user.sub, id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.productsService.remove(id, req.user.sub);
  }
}
