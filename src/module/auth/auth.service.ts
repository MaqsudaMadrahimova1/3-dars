import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const foundedUser = await this.authRepo.findOne({
      where: { email: createAuthDto.email }
    });
    if (foundedUser) throw new BadRequestException("Foydalanuvchi allaqachon mavjud");

    const hashPassword = await bcrypt.hash(createAuthDto.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTime = Date.now() + 120000;

    const newUser = this.authRepo.create({
      email: createAuthDto.email,
      username: createAuthDto.username,
      password: hashPassword,
      otp,
      otpTime,
    });

    await this.authRepo.save(newUser);
    return { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", otp };
  }

  async login(createAuthDto: CreateAuthDto) {
    const foundedUser = await this.authRepo.findOne({
      where: { email: createAuthDto.email }
    });
    if (!foundedUser) throw new BadRequestException("Email yoki parol noto'g'ri");

    const checkPassword = await bcrypt.compare(createAuthDto.password, foundedUser.password);

    if (checkPassword) {
      const otp = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 9)
      ).join("");
      const otpTime = Date.now() + 120000;

      await this.authRepo.update(foundedUser.id, { otp, otpTime });

      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: foundedUser.email,
        subject: "Tasdiqlash kodi",
        text: "OTP kodingiz",
        html: `<b>${otp}</b>`,
      });

      return { message: "OTP emailga yuborildi", expireTime: otpTime };
    } else {
      throw new BadRequestException("Email yoki parol noto'g'ri");
    }
  }

  async verify(dto: VerifyDto) {
    const { email, otp } = dto;

    const foundeduser = await this.authRepo.findOne({ where: { email } });

    const otpValidation = /^\d{6}$/.test(otp);

    if (!otpValidation) throw new BadRequestException("Invalid otp");
    if (!foundeduser) throw new UnauthorizedException("Email not found");
    if (foundeduser.otp !== otp) throw new BadRequestException("Wrong otp");

    const now = Date.now();
    if (foundeduser.otpTime && foundeduser.otpTime < now)
      throw new BadRequestException("Otp expired");

    await this.authRepo.update(foundeduser.id, { otp: "", otpTime: 0 });

    const payload = { id: foundeduser.id, username: foundeduser.username, role: foundeduser.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findAll() {
    return await this.authRepo.find({
      select: ['id', 'username', 'email'],
      relations: ['articles']
    });
  }

  async findOne(id: number) {
    return await this.authRepo.findOne({
      where: { id },
      select: ['id', 'username', 'email']
    });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    await this.authRepo.update(id, updateAuthDto);
    return await this.authRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.authRepo.delete(id);
  }

  async findByEmail(email: string) {
    return await this.authRepo.findOne({ where: { email } });
  }
}