import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { VerifyDomainDto } from './dto/verify-domain.dto';
import { DnsRecordType, DnsRecordStatus, DomainStatus } from '@prisma/client';

@Injectable()
export class DomainsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDomainDto: CreateDomainDto) {
    const normalizedDomain = createDomainDto.name.trim().toLowerCase();

    const existingDomain = await this.prisma.domain.findUnique({
      where: { name: normalizedDomain },
    });

    if (existingDomain) {
      throw new BadRequestException('Domain already exists');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: createDomainDto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const verificationToken = this.generateVerificationToken();

    return this.prisma.domain.create({
      data: {
        name: normalizedDomain,
        organizationId: createDomainDto.organizationId,
        isCatchAllEnabled: createDomainDto.isCatchAllEnabled ?? false,
        verificationToken,
        status: DomainStatus.PENDING,
        dnsRecords: {
          create: this.buildDefaultDnsRecords(verificationToken),
        },
      },
      include: {
        organization: true,
        dnsRecords: true,
      },
    });
  }

  async findAll() {
    return this.prisma.domain.findMany({
      include: {
        organization: true,
        dnsRecords: true,
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
        dnsRecords: true,
      },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    return domain;
  }

  async verify(id: string, dto: VerifyDomainDto) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
      include: { dnsRecords: true },
    });

    if (!domain) {
      throw new NotFoundException('Domain not found');
    }

    if (dto.token && dto.token !== domain.verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.prisma.domainDnsRecord.updateMany({
      where: { domainId: id },
      data: {
        status: DnsRecordStatus.VERIFIED,
      },
    });

    return this.prisma.domain.update({
      where: { id },
      data: {
        status: DomainStatus.VERIFIED,
        verifiedAt: new Date(),
      },
      include: {
        organization: true,
        dnsRecords: true,
      },
    });
  }

  private generateVerificationToken(): string {
    return randomBytes(16).toString('hex');
  }

  private buildDefaultDnsRecords(verificationToken: string) {
    return [
      {
        type: DnsRecordType.MX,
        host: '@',
        value: 'inbound1.mailforge.dev',
        priority: 10,
        ttl: 3600,
        status: DnsRecordStatus.REQUIRED,
        isOptional: false,
      },
      {
        type: DnsRecordType.MX,
        host: '@',
        value: 'inbound2.mailforge.dev',
        priority: 20,
        ttl: 3600,
        status: DnsRecordStatus.REQUIRED,
        isOptional: false,
      },
      {
        type: DnsRecordType.TXT,
        host: '@',
        value: 'v=spf1 include:mailforge.dev ~all',
        ttl: 3600,
        status: DnsRecordStatus.REQUIRED,
        isOptional: false,
      },
      {
        type: DnsRecordType.CNAME,
        host: 'mail._domainkey',
        value: 'mailforge-dev._domainkey.mailforge.dev',
        ttl: 3600,
        status: DnsRecordStatus.REQUIRED,
        isOptional: false,
      },
      {
        type: DnsRecordType.TXT,
        host: '_dmarc',
        value: 'v=DMARC1; p=none; rua=mailto:dmarc@mailforge.dev',
        ttl: 3600,
        status: DnsRecordStatus.REQUIRED,
        isOptional: true,
      },
      {
        type: DnsRecordType.TXT,
        host: '_mailforge-verification',
        value: verificationToken,
        ttl: 3600,
        status: DnsRecordStatus.REQUIRED,
        isOptional: false,
      },
    ];
  }
}
