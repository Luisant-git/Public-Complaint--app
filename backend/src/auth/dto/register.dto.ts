// src/auth/dto/register.dto.ts
import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'Super Admin',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'admin@complaint.gov',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for admin login',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string;
}