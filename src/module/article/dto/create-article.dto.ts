import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Tag } from 'src/tag/entities/tag.entity';

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

  @Transform(({ value }) => {
    typeof value === 'string' ? value.split(',')
    .map((item) => Number(item)) : value
  })
  @IsArray()
  @IsInt({each: true})
  tags!:any


  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID si' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  file?: Express.Multer.File;
}