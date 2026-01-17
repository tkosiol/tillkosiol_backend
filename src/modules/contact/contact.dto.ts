import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Max Mustermann', description: 'Name des Absenders' })
  @IsString()
  @IsNotEmpty({ message: 'Name ist erforderlich' })
  @MinLength(2, { message: 'Name muss mindestens 2 Zeichen lang sein' })
  @MaxLength(255, { message: 'Name darf maximal 255 Zeichen lang sein' })
  name!: string;

  @ApiProperty({ example: 'max@example.com', description: 'E-Mail des Absenders' })
  @IsEmail({}, { message: 'Ungültige E-Mail-Adresse' })
  @IsNotEmpty({ message: 'E-Mail ist erforderlich' })
  @MaxLength(255, { message: 'E-Mail darf maximal 255 Zeichen lang sein' })
  email!: string;

  @ApiPropertyOptional({ example: 'Anfrage zur Zusammenarbeit', description: 'Betreff der Nachricht' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Betreff darf maximal 500 Zeichen lang sein' })
  subject?: string;

  @ApiProperty({ example: 'Hallo, ich würde gerne...', description: 'Nachrichtentext' })
  @IsString()
  @IsNotEmpty({ message: 'Nachricht ist erforderlich' })
  @MinLength(10, { message: 'Nachricht muss mindestens 10 Zeichen lang sein' })
  @MaxLength(5000, { message: 'Nachricht darf maximal 5000 Zeichen lang sein' })
  message!: string;
}

export class UpdateContactMessageDto {
  @ApiPropertyOptional({ example: true, description: 'Als gelesen markieren' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Archivieren' })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}

export class ContactMessageResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Max Mustermann' })
  name!: string;

  @ApiProperty({ example: 'max@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'Anfrage zur Zusammenarbeit' })
  subject!: string | null;

  @ApiProperty({ example: 'Hallo, ich würde gerne...' })
  message!: string;

  @ApiProperty({ example: false })
  isRead!: boolean;

  @ApiProperty({ example: false })
  isArchived!: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt!: string;

  @ApiPropertyOptional({ example: '2024-01-15T11:00:00.000Z' })
  readAt!: string | null;
}
