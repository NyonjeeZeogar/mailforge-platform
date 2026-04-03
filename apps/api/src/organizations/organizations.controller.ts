import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  async create(@Body() body: { name: string }) {
    return this.organizationsService.create(body);
  }

  @Get()
  async findAll() {
    return this.organizationsService.findAll();
  }
}
