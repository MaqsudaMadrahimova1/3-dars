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

  async findAll(query: QueryDto): Promise<Article[]> {
    const {page = 1, limit = 10, search} = query
    const queryBuilder = await this.articleRepo.createQueryBuilder("article")
   .leftJoinAndSelect("article.tags", "tags")
   .where("article.deletedAt is null")
   

   if(search){
    queryBuilder.andWhere("article.title ILIKE: search or articles.", {search: `%${search}`})
   }
    return await this.articleRepo.find();
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