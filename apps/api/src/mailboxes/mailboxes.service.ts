import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMailboxDto } from './dto/create-mailbox.dto';

@Injectable()
export class MailboxesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMailboxDto: CreateMailboxDto) {
    const localPart = createMailboxDto.localPart.trim().toLowerCase();
    const password = createMailboxDto.password.trim();

    const domain = await this.prisma.domain.findUnique({
      where: { id: createMailboxDto.domainId },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    // ✅ THIS is the correct field
    const address = `${localPart}@${domain.name}`;

    // ✅ address is UNIQUE in your schema
    const existingMailbox = await this.prisma.mailbox.findUnique({
      where: { address },
    });

    if (existingMailbox) {
      throw new BadRequestException('Mailbox already exists');
    }

    return this.prisma.mailbox.create({
      data: {
        address, // ✅ correct field
        password,
        domainId: createMailboxDto.domainId,
      },
      include: {
        domain: true,
      },
    });
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

    return { success: true };
  }
}
