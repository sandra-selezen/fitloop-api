import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { FavoritesService } from 'src/favorites/favorites.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/favorites')
  getFavorites(@Request() req: AuthenticatedRequest) {
    return this.favoritesService.findAll(req.user.sub);
  }
}
