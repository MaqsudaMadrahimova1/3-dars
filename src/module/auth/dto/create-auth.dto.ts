import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
  @ApiProperty({ example: 'John', description: 'Foydalanuvchi ismi' })
  @IsString()
  @MinLength(3, { message: "Kamida 3 ta harf bo'lsin" })
  @MaxLength(50)
  username!: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'Email manzil' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123', description: 'Kamida 8 belgi, 1 katta, 1 kichik harf, 1 raqam' })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: "Parol kamida 8 belgi, 1 katta harf, 1 kichik harf va 1 raqam bo'lishi kerak"
  })
  password!: string;
}