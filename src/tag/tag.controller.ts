import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiBearerAuth('JWT-auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiTags('Tags')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN,RolesUser.USER)
  @Post()
  @ApiOperation({ summary: 'Yangi tag yaratish' })
  @ApiResponse({ status: 201, description: 'Tag yaratildi' })
  @ApiResponse({ status: 400, description: 'Tag allaqachon mavjud' })
  create(@Body() createTagDto: CreateTagDto, @Request() req: any) {
    return this.tagService.create(createTagDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha taglar' })
  @ApiResponse({ status: 200, description: 'Taglar ro\'yxati' })
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta tag' })
  @ApiResponse({ status: 200, description: 'Tag topildi' })
  @ApiResponse({ status: 404, description: 'Tag topilmadi' })
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Tagni yangilash' })
  @ApiResponse({ status: 200, description: 'Tag yangilandi' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Tagni o\'chirish' })
  @ApiResponse({ status: 200, description: 'Tag o\'chirildi' })
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}