import { Module } from '@nestjs/common';
import { MailboxesController } from './mailboxes.controller';
import { MailboxesService } from './mailboxes.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MailboxesController],
  providers: [MailboxesService, PrismaService],
})
export class MailboxesModule {}
