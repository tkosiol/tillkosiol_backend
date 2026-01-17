import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@/db/database.module';
import { contactMessages, ContactMessage } from '@/db/schema';
import { CreateContactMessageDto, ContactMessageResponseDto, UpdateContactMessageDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(
    dto: CreateContactMessageDto,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<ContactMessageResponseDto> {
    const [message] = await this.db
      .insert(contactMessages)
      .values({
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
        ipAddress,
        userAgent,
      })
      .returning();

    return this.toResponseDto(message);
  }

  async findAll(): Promise<ContactMessageResponseDto[]> {
    const messages = await this.db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    return messages.map((msg) => this.toResponseDto(msg));
  }

  async findOne(id: number): Promise<ContactMessageResponseDto> {
    const [message] = await this.db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));

    if (!message) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    return this.toResponseDto(message);
  }

  async update(id: number, dto: UpdateContactMessageDto): Promise<ContactMessageResponseDto> {
    // Check if message exists
    await this.findOne(id);

    const updateData: Partial<ContactMessage> = {};

    if (dto.isRead !== undefined) {
      updateData.isRead = dto.isRead;
      if (dto.isRead) {
        updateData.readAt = new Date();
      }
    }

    if (dto.isArchived !== undefined) {
      updateData.isArchived = dto.isArchived;
    }

    const [updated] = await this.db
      .update(contactMessages)
      .set(updateData)
      .where(eq(contactMessages.id, id))
      .returning();

    return this.toResponseDto(updated);
  }

  async markAsRead(id: number): Promise<ContactMessageResponseDto> {
    return this.update(id, { isRead: true });
  }

  async countUnread(): Promise<number> {
    const result = await this.db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false));

    return result.length;
  }

  private toResponseDto(message: ContactMessage): ContactMessageResponseDto {
    return {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      isRead: message.isRead,
      isArchived: message.isArchived,
      createdAt: message.createdAt.toISOString(),
      readAt: message.readAt?.toISOString() ?? null,
    };
  }
}
