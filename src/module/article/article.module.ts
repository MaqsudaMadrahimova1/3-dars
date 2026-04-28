// article.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article,Tag]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}