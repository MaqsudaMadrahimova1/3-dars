import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
    userId: any,
  ) {
    const foundedTags = await this.tagRepo.findBy({
      id: In(createArticleDto.tags),
    });

    if (!foundedTags) throw new BadRequestException();

    const article = this.articleRepo.create({
      ...createArticleDto,
      author: userId,
      tags: foundedTags,
    });

    article.backgroundImage = `http://localhost:4001/uploads/${file.filename}`;
    return await this.articleRepo.save(article);
  }

  async findAll(queryDto: QueryDto) {
    const { page = 1, limit = 10, search } = queryDto;

    const queryBuilder = this.articleRepo.createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.deletedAt is null');

    if (search) {
      queryBuilder.andWhere(
        'article.title ILIKE :search or article.content ILIKE :search or tags.name ILIKE :search',
        { search: `%${search}%` }
      );
    }

    const result = await queryBuilder
      .orderBy('article.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const total = await queryBuilder.getCount();

    return {
      totalPage: Math.ceil(total / limit),
      prev: page > 1 ? (page - 1) : undefined,
      next: page * limit < total ? (page + 1) : undefined,
      result,
    };
  }

  async findOne(id: number): Promise<Article> {
    const foundedArticle = await this.articleRepo.findOne({
      where: { id },
      relations: ['tags', 'author'],
    });

    if (!foundedArticle) throw new NotFoundException('Article not found');

    return foundedArticle;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<{ message: string }> {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (updateArticleDto.title !== undefined) {
      article.title = updateArticleDto.title;
    }

    if (updateArticleDto.content !== undefined) {
      article.content = updateArticleDto.content;
    }

    if (updateArticleDto.tags) {
      const foundedTags = await this.tagRepo.findBy({
        id: In(updateArticleDto.tags),
      });
      article.tags = foundedTags;
    }

    await this.articleRepo.save(article);
    return { message: 'Updated' };
  }

  async remove(id: number) {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    await this.articleRepo.delete(id);
    return { message: 'Deleted' };
  }
}