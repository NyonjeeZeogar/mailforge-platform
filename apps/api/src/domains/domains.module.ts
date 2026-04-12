import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityEventsModule } from '../activity-events/activity-events.module';

@Module({
  imports: [ActivityEventsModule],
  controllers: [DomainsController],
  providers: [DomainsService, PrismaService],
})
export class DomainsModule {}
