import { Controller, Post, Get, Param, Patch, Body, Req, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactMessageDto, ContactMessageResponseDto, UpdateContactMessageDto } from './contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Max 5 Nachrichten pro Minute
  @ApiOperation({ summary: 'Kontaktformular absenden' })
  @ApiBody({ type: CreateContactMessageDto })
  @ApiResponse({ status: 201, description: 'Nachricht wurde gespeichert' })
  @ApiResponse({ status: 400, description: 'Ungültige Eingabedaten' })
  @ApiResponse({ status: 429, description: 'Zu viele Anfragen' })
  async create(
    @Body() createDto: CreateContactMessageDto,
    @Req() request: Request,
  ): Promise<ContactMessageResponseDto> {
    const ipAddress = this.getClientIp(request);
    const userAgent = request.headers['user-agent'] || null;

    return this.contactService.create(createDto, ipAddress, userAgent);
  }

  // === Admin Endpoints (später mit Auth schützen) ===

  @Get()
  @ApiOperation({ summary: 'Alle Kontaktnachrichten abrufen' })
  @ApiResponse({ status: 200, description: 'Liste aller Nachrichten' })
  async findAll(): Promise<ContactMessageResponseDto[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Einzelne Kontaktnachricht abrufen' })
  @ApiResponse({ status: 200, description: 'Nachricht gefunden' })
  @ApiResponse({ status: 404, description: 'Nachricht nicht gefunden' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ContactMessageResponseDto> {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kontaktnachricht aktualisieren (gelesen/archiviert)' })
  @ApiResponse({ status: 200, description: 'Nachricht aktualisiert' })
  @ApiResponse({ status: 404, description: 'Nachricht nicht gefunden' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateContactMessageDto,
  ): Promise<ContactMessageResponseDto> {
    return this.contactService.update(id, updateDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Nachricht als gelesen markieren' })
  @ApiResponse({ status: 200, description: 'Nachricht als gelesen markiert' })
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<ContactMessageResponseDto> {
    return this.contactService.markAsRead(id);
  }

  private getClientIp(request: Request): string | null {
    const forwardedFor = request.headers['x-forwarded-for'];
    
    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }
    
    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0];
    }
    
    return request.ip || null;
  }
}
