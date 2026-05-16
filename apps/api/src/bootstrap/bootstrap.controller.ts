import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('bootstrap')
export class BootstrapController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('status')
  async getStatus() {
    const organizationCount = await this.prisma.organization.count();
    const domainCount = await this.prisma.domain.count();
    const mailboxCount = await this.prisma.mailbox.count();

    return {
      hasOrganization: organizationCount > 0,
      hasDomain: domainCount > 0,
      hasMailbox: mailboxCount > 0,
      isOnboarded:
        organizationCount > 0 &&
        domainCount > 0 &&
        mailboxCount > 0,
    };
  }
}
