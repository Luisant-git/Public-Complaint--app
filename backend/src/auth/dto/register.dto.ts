// src/auth/dto/register.dto.ts
import { IsString, IsEmail, Length, IsNotEmpty, Matches } from 'class-validator';
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
    description: 'Mobile number (10 digits)',
    example: '9876543210',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile must be exactly 10 digits' })
  mobile: string;

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
