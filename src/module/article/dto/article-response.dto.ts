import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Mening maqolam' })
  title: string;

  @ApiProperty({ example: 'Maqola matni...' })
  content: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'image.jpg' })
  image?: string;
}