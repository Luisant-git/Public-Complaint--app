// src/complaint/complaint.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Complaints')
@ApiBearerAuth()
@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new complaint' })
  @ApiBody({ type: CreateComplaintDto })
  create(@Body() body: CreateComplaintDto, @Request() req) {
    return this.complaintService.create(body, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get complaints of the logged-in public user' })
  myComplaints(@Request() req) {
    return this.complaintService.myComplaints(req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiOperation({ summary: 'Get complaint statistics (Admin only)' })
  getStats() {
    return this.complaintService.getStats();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiOperation({ summary: 'Get all complaints with optional filtering and search (Admin only)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by complaint type' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for name, mobile, number, or description' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Filter from date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Filter to date (YYYY-MM-DD)' })
  findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.complaintService.findAll(status, type, search, fromDate, toDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific complaint' })
  @ApiParam({ name: 'id', type: Number, description: 'Complaint database ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complaintService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  @ApiOperation({ summary: 'Update complaint status and remarks (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Complaint database ID' })
  @ApiBody({ type: UpdateComplaintDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateComplaintDto,
  ) {
    return this.complaintService.update(id, body);
  }
}
