import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateArticleFileDto {
  @ApiProperty({ example: 'Mening maqolam' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Maqola matni...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Rasm fayl' })
  file?: Express.Multer.File;
}