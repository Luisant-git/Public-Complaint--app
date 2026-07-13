// src/complaint/complaint.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  private async generateComplaintNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CMP${year}`;

    const latestComplaint = await this.prisma.complaint.findFirst({
      where: {
        number: {
          startsWith: prefix,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    let nextSerial = 1;
    if (latestComplaint) {
      const serialStr = latestComplaint.number.substring(prefix.length);
      const currentSerial = parseInt(serialStr, 10);
      if (!isNaN(currentSerial)) {
        nextSerial = currentSerial + 1;
      }
    }

    return `${prefix}${String(nextSerial).padStart(5, '0')}`;
  }

  async create(createComplaintDto: CreateComplaintDto, userId: number) {
    const number = await this.generateComplaintNumber();

    return this.prisma.complaint.create({
      data: {
        number,
        type: createComplaintDto.type,
        description: createComplaintDto.description,
        location: createComplaintDto.location,
        images: createComplaintDto.images ? JSON.stringify(createComplaintDto.images) : null,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll(status?: string, type?: string, search?: string, fromDate?: string, toDate?: string) {
    const where: any = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { mobile: { contains: search } },
            ],
          },
        },
      ];
    }

    // Date range filter (expects YYYY-MM-DD)
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        const from = new Date(fromDate);
        // start of day
        from.setHours(0, 0, 0, 0);
        where.createdAt.gte = from;
      }
      if (toDate) {
        const to = new Date(toDate);
        // end of day
        to.setHours(23, 59, 59, 999);
        where.createdAt.lte = to;
      }
    }

    return this.prisma.complaint.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    return complaint;
  }

  async myComplaints(userId: number) {
    return this.prisma.complaint.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, updateComplaintDto: UpdateComplaintDto) {
    const existing = await this.findOne(id);

    const { status } = updateComplaintDto;
    const data: any = { ...updateComplaintDto };

    // Auto-set date fields when status changes
    if (status && status !== existing.status) {
      if (status === 'நடவடிக்கை எடுக்கப்பட்டது') {
        data.actionTakenAt = new Date();
      }
      if (status === 'தீர்க்கப்பட்டது') {
        data.resolvedAt = new Date();
      }
    }

    return this.prisma.complaint.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async getStats() {
    const total = await this.prisma.complaint.count();
    const pending = await this.prisma.complaint.count({
      where: { status: 'பரிசீலனையில் உள்ளது' },
    });
    const action = await this.prisma.complaint.count({
      where: { status: 'நடவடிக்கை எடுக்கப்பட்டது' },
    });
    const resolved = await this.prisma.complaint.count({
      where: { status: 'தீர்க்கப்பட்டது' },
    });

    // Group counts by type
    const groups = await this.prisma.complaint.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    });

    const byType = groups.reduce((acc, curr) => {
      acc[curr.type] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      pending,
      action,
      resolved,
      byType,
    };
  }
}
