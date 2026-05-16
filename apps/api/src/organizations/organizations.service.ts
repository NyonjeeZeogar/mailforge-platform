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
    const organization = await this.prisma.organization.create({
      data: {
        name: createOrganizationDto.name,
        supportEmail: createOrganizationDto.supportEmail ?? null,
        timezone: createOrganizationDto.timezone ?? null,
        plan: createOrganizationDto.plan ?? 'business',
        status: createOrganizationDto.status ?? 'active',
      },
    });

    await this.activityEventsService.create({
      type: 'organization_created',
      message: `Organization created: ${organization.name}`,
      entityType: 'organization',
      entityId: organization.id,
    });

    return organization;
  }

  async findAll() {
    return this.prisma.organization.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        domains: true,
        users: true,
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
        plan:
          updateOrganizationDto.plan !== undefined
            ? updateOrganizationDto.plan
            : organization.plan,
        status:
          updateOrganizationDto.status !== undefined
            ? updateOrganizationDto.status
            : organization.status,
      },
    });

    await this.activityEventsService.create({
      type: 'organization_updated',
      message: `Organization settings updated: ${updatedOrganization.name}`,
      entityType: 'organization',
      entityId: updatedOrganization.id,
    });

    return updatedOrganization;
  }

  async remove(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.prisma.organization.delete({
      where: { id },
    });

    await this.activityEventsService.create({
      type: 'organization_deleted',
      message: `Organization deleted: ${organization.name}`,
      entityType: 'organization',
      entityId: id,
    });

    return { success: true };
  }
}
