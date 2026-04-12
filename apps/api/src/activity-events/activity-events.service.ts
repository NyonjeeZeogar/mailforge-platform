import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.activityEvent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  async create(data: {
    type: string;
    message: string;
    entityType?: string;
    entityId?: string;
  }) {
    return this.prisma.activityEvent.create({
      data: {
        type: data.type,
        message: data.message,
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });
  }
}
