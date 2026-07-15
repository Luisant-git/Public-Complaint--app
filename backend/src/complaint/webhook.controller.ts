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
    return this.complaintService.createFromWebhook(body);
  }
}
