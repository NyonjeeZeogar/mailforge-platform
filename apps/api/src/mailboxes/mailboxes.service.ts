import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMailboxDto } from './dto/create-mailbox.dto';
import { ActivityEventsService } from '../activity-events/activity-events.service';

@Injectable()
export class MailboxesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityEventsService: ActivityEventsService,
  ) {}

  async create(createMailboxDto: CreateMailboxDto) {
    const localPart = createMailboxDto.localPart.trim().toLowerCase();
    const password = createMailboxDto.password.trim();

    const domain = await this.prisma.domain.findUnique({
      where: { id: createMailboxDto.domainId },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    const address = `${localPart}@${domain.name}`;

    const existingMailbox = await this.prisma.mailbox.findUnique({
      where: { address },
    });

    if (existingMailbox) {
      throw new BadRequestException('Mailbox already exists');
    }

    const mailbox = await this.prisma.mailbox.create({
      data: {
        address,
        password,
        domainId: createMailboxDto.domainId,
      },
      include: {
        domain: true,
      },
    });

    await this.activityEventsService.create({
      type: 'mailbox_created',
      message: `New mailbox ${mailbox.address} created`,
      entityType: 'mailbox',
      entityId: mailbox.id,
    });

    return mailbox;
  }

  async findAll() {
    return this.prisma.mailbox.findMany({
      include: {
        domain: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const mailbox = await this.prisma.mailbox.findUnique({
      where: { id },
      include: {
        domain: true,
      },
    });

    if (!mailbox) {
      throw new NotFoundException('Mailbox not found');
    }

    return mailbox;
  }

  async remove(id: string) {
    const mailbox = await this.prisma.mailbox.findUnique({
      where: { id },
    });

    if (!mailbox) {
      throw new NotFoundException('Mailbox not found');
    }

    await this.prisma.mailbox.delete({
      where: { id },
    });

    await this.activityEventsService.create({
      type: 'mailbox_deleted',
      message: `Mailbox ${mailbox.address} deleted`,
      entityType: 'mailbox',
      entityId: mailbox.id,
    });

    return { success: true };
  }
}
