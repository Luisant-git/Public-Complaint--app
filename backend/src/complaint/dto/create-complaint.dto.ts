// src/complaint/dto/create-complaint.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty({
    description: 'Type/category of complaint (e.g. Water Supply, Road Damage)',
    example: 'சாலை குறை',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Detailed description of the problem',
    example: 'சாலையில் பெரிய குழி உள்ளது.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Location where the issue occurred',
    example: 'Anna Nagar, Chennai',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({
    description: 'Array of uploaded image URLs (returned by POST /upload/image)',
    example: ['http://localhost:3000/uploads/abc123.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
