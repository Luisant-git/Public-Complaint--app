// src/auth/dto/login.dto.ts
import { IsString, Length, Matches, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    description: 'Admin mobile number (10 digits)',
    example: '9876543210',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile must be exactly 10 digits' })
  mobile: string;

  @ApiProperty({
    description: 'Admin password',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string;
}

export class UserLoginDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
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
}