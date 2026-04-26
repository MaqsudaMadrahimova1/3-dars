import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyDto } from './dto/verify.dto'; 
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchi royxatdan otkazish' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli ro\'yxatdan o\'tdi' })
  @ApiBadRequestResponse({ description: 'Foydalanuvchi allaqachon mavjud' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiResponse({ status: 200, description: 'OTP emailga yuborildi' })
  @ApiBadRequestResponse({ description: 'Email yoki parol noto\'g\'ri' })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'OTP tasdiqlash' })
  @ApiResponse({ status: 200, description: 'Email tasdiqlandi' })
  @ApiBadRequestResponse({ description: 'OTP noto\'g\'ri' })
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilar' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro\'yxati' })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchi' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi topildi' })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  @ApiResponse({ status: 200, description: 'Yangilandi' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish' })
  @ApiResponse({ status: 200, description: 'O\'chirildi' })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}