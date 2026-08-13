import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { LoginDto } from 'src/auth/dto/login.dto';

export class UpdateUserDto extends PartialType(LoginDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
