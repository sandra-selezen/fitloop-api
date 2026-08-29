import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'john.doe@mail.com',
    description: 'E-mail address',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
