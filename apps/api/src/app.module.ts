import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DomainsModule } from './domains/domains.module';
import { MailboxesModule } from './mailboxes/mailboxes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ActivityEventsModule } from './activity-events/activity-events.module';

@Module({
  imports: [PrismaModule, AuthModule, OrganizationsModule, DomainsModule, MailboxesModule, UsersModule, ActivityEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
