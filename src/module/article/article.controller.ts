import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Query, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleFileDto } from './dto/article-file.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { QueryDto } from './dto/query.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiTags('Articles')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @ApiBody({ type: CreateArticleFileDto })
  @Post()
  @ApiOperation({ summary: 'Yangi maqola yaratish' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${file.originalname}${Date.now()}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.articleService.create(createArticleDto, file, req.user.id);
  }

  @ApiOkResponse({
    description: 'list of articles',
    type: [ArticleResponseDto],
  })
  @HttpCode(200)
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.articleService.findAll(query);
  }

  @ApiNotFoundResponse({ description: 'Article not found' })
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @ApiOkResponse({ description: 'Updated' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @ApiNotFoundResponse({ description: 'Article not found' })
  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}