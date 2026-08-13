import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    console.log('USER FROM JWT:', req.user);
    return this.usersService.update(req.user.sub, dto);
  }
}
