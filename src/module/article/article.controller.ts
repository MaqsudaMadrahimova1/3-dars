import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiBody, ApiConsumes, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleFileDto } from './dto/article-file.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@ApiTags('Articles')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @ApiOkResponse()
  @ApiBody({ type: CreateArticleFileDto })
  @Post()
  @ApiOperation({ summary: 'Yangi maqola yaratish' })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${file.originalname}${Date.now()}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.articleService.create({ ...createArticleDto, file });
  }

  @Get()
  @ApiOperation({ summary: 'Barcha maqolalarni olish' })
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta maqolani olish' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Maqolani yangilash' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Maqolani o\'chirish' })
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}