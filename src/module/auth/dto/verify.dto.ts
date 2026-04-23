import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ example: 'maqsuda@gmail.com', description: 'Email manzil' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6 xonali OTP kod' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP 6 ta raqam bo\'lishi kerak' })
  otp: string;
}