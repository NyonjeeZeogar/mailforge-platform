import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { ActivityEventsService } from '../activity-events/activity-events.service';

@Injectable()
export class DomainsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityEventsService: ActivityEventsService,
  ) {}

  async create(createDomainDto: CreateDomainDto) {
    const name = createDomainDto.name.trim().toLowerCase();

    const existingDomain = await this.prisma.domain.findUnique({
      where: { name },
    });

    if (existingDomain) {
      throw new BadRequestException('Domain already exists');
    }

    const domain = await this.prisma.domain.create({
      data: {
        name,
        organizationId: createDomainDto.organizationId,
      },
      include: {
        organization: true,
      },
    });

    await this.activityEventsService.create({
      type: 'domain_created',
      message: `Domain ${domain.name} added`,
      entityType: 'domain',
      entityId: domain.id,
    });

    return domain;
  }

  async findAll() {
    return this.prisma.domain.findMany({
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    return domain;
  }

  async verify(id: string, _dto?: unknown) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    // Placeholder verify implementation for now.
    // Keeps the existing controller route working until real DNS verification is added.
    return {
      ...domain,
      verified: true,
    };
  }

  async remove(id: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    await this.prisma.domain.delete({
      where: { id },
    });

    await this.activityEventsService.create({
      type: 'domain_deleted',
      message: `Domain ${domain.name} deleted`,
      entityType: 'domain',
      entityId: domain.id,
    });

    return { success: true };
  }
}
