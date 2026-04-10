import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MailboxesService } from './mailboxes.service';
import { CreateMailboxDto } from './dto/create-mailbox.dto';

@Controller('mailboxes')
export class MailboxesController {
  constructor(private readonly mailboxesService: MailboxesService) {}

  @Post()
  create(@Body() createMailboxDto: CreateMailboxDto) {
    return this.mailboxesService.create(createMailboxDto);
  }

  @Get()
  findAll() {
    return this.mailboxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailboxesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailboxesService.remove(id);
  }
}
