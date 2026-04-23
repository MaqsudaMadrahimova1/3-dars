import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { Auth } from './entities/auth.entity';
import { Article } from 'src/module/article/model/article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  register(createAuthDto: CreateAuthDto) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectRepository(Auth) private authRepo: typeof Auth) {}

  //  async register(createAuthDto: CreateAuthDto) {
  //   const foundedUser = await this.authRepo.findOne({ where: { email: createAuthDto.email }, raw: true });
  //   if (foundedUser) throw new BadRequestException("user already exists");
    
  //   const hashPassword = await bcrypt.hash(createAuthDto.password, 10);
  //   return this.authRepo.create({
  //     email: createAuthDto.email,
  //     username: createAuthDto.username,
  //     password: hashPassword,
  //     otp: createAuthDto.otp
  //   });
  // }

  // findAll() {
  //     return this.authRepo.findAll({
  //       attributes: { exclude: ['password'] },
  //       include: [{ model: Article, attributes: ['id', 'title', 'content'] }]
  //     });
  //   }

   findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async findByEmail(email: string) {
    return this.authRepo.findOne({ where: { email }, raw: true });
  }
}