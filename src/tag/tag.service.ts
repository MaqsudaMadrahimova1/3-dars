import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto, userId: any) {
  
    const foundedTag = await this.tagRepo.findOne({ where: { name: createTagDto.name } });
    if (foundedTag) throw new BadRequestException('Bu tag allaqachon mavjud');

    const tag = this.tagRepo.create({...createTagDto,createdBy: userId});
    await this.tagRepo.save(tag);
    return { message: 'Tag yaratildi', tag };
  }

  async findAll() {
    return await this.tagRepo.find({ relations: ['articles'] });
  }

  async findOne(id: number) {
    const tag = await this.tagRepo.findOne({ where: { id }, relations: ['articles'] });
    if (!tag) throw new NotFoundException('Tag topilmadi');
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag topilmadi');

    await this.tagRepo.update(id, updateTagDto);
    return { message: 'Tag yangilandi', tag: await this.tagRepo.findOne({ where: { id } }) };
  }

  async remove(id: number) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag topilmadi');

    await this.tagRepo.delete(id);
    return { message: 'Tag o\'chirildi' };
  }
}