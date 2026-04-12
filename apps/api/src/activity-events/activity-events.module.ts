import { Module } from '@nestjs/common';
import { ActivityEventsController } from './activity-events.controller';
import { ActivityEventsService } from './activity-events.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ActivityEventsController],
  providers: [ActivityEventsService, PrismaService],
  exports: [ActivityEventsService],
})
export class ActivityEventsModule {}
