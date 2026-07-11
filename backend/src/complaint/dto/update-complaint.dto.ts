// src/complaint/dto/update-complaint.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateComplaintDto {
  @ApiPropertyOptional({
    description: 'Status of the complaint',
    example: 'பரிசீலனையில் உள்ளது',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Name of the staff member assigned to the complaint',
    example: 'Arjun Mehta',
  })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Remarks/comments on the action taken',
    example: 'Investigated the leak and fixed the pipe line.',
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}
