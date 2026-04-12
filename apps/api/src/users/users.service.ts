import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { ActivityEventsService } from '../activity-events/activity-events.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityEventsService: ActivityEventsService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async invite(inviteUserDto: InviteUserDto) {
    const email = inviteUserDto.email.trim().toLowerCase();
    const name = inviteUserDto.name?.trim() || null;
    const role = inviteUserDto.role?.trim() || 'member';

    const organization = await this.prisma.organization.findUnique({
      where: { id: inviteUserDto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
        organizationId: inviteUserDto.organizationId,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email already exists in this organization',
      );
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        role,
        passwordHash: '',
        organizationId: inviteUserDto.organizationId,
      },
      include: {
        organization: true,
      },
    });

    await this.activityEventsService.create({
      type: 'user_invited',
      message: `New user ${user.name || user.email} invited`,
      entityType: 'user',
      entityId: user.id,
    });

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    await this.activityEventsService.create({
      type: 'user_deleted',
      message: `User ${user.name || user.email} deleted`,
      entityType: 'user',
      entityId: user.id,
    });

    return { success: true };
  }
}
