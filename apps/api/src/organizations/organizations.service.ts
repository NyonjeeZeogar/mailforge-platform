import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ActivityEventsService } from '../activity-events/activity-events.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityEventsService: ActivityEventsService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: createOrganizationDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const updatedOrganization = await this.prisma.organization.update({
      where: { id },
      data: {
        name: updateOrganizationDto.name ?? organization.name,
        supportEmail:
          updateOrganizationDto.supportEmail !== undefined
            ? updateOrganizationDto.supportEmail
            : organization.supportEmail,
        timezone:
          updateOrganizationDto.timezone !== undefined
            ? updateOrganizationDto.timezone
            : organization.timezone,
      },
    });

    const changes: string[] = [];

    if (
      updateOrganizationDto.name !== undefined &&
      updateOrganizationDto.name !== organization.name
    ) {
      changes.push(`name → ${updatedOrganization.name}`);
    }

    if (
      updateOrganizationDto.supportEmail !== undefined &&
      updateOrganizationDto.supportEmail !== organization.supportEmail
    ) {
      changes.push(
        `support email → ${updatedOrganization.supportEmail || 'cleared'}`,
      );
    }

    if (
      updateOrganizationDto.timezone !== undefined &&
      updateOrganizationDto.timezone !== organization.timezone
    ) {
      changes.push(`timezone → ${updatedOrganization.timezone || 'cleared'}`);
    }

    if (changes.length > 0) {
      await this.activityEventsService.create({
        type: 'organization_updated',
        message: `Organization settings updated (${changes.join(', ')})`,
        entityType: 'organization',
        entityId: updatedOrganization.id,
      });
    }

    return updatedOrganization;
  }
}
