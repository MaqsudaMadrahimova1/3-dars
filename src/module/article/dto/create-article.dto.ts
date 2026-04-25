import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Mening maqolam', description: 'Maqola sarlavhasi' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'Maqola matni...', description: 'Maqola content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID si' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  file?: Express.Multer.File;
}