// src/complaint/complaint.module.ts
import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { WebhookController } from './webhook.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ComplaintService],
  controllers: [ComplaintController, WebhookController],
  exports: [ComplaintService],
})
export class ComplaintModule {}
