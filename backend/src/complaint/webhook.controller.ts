import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@ApiTags('Complaints Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('whatsapp')
  @ApiOperation({ summary: 'Submit a new complaint from WhatsApp bot without auth' })
  @ApiBody({ type: CreateComplaintDto })
  createFromWhatsapp(@Body() body: CreateComplaintDto) {
    // Assuming 1 is the default admin/system user id
    return this.complaintService.create(body, 1);
  }
}
