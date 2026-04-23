import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './module/auth/auth.module';
// import { ArticleModule } from './article/article.module';
import { Auth } from './module/auth/entities/auth.entity';
import { Article } from './module/article/model/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [ConfigModule.forRoot({envFilePath:".env",isGlobal:true}),
    TypeOrmModule.forRoot({
      type:"postgres",
      host:"127.0.0.1",
      port:5432,
      username:"postgres",
      database:String(process.env.DB_NAME as string),
      password:String(process.env.DB_PASSWORD as string),
      // models:[Auth,Article],
      entities:[Auth],
      synchronize:true,
      logging:false

    }),
    AuthModule,
    // ArticleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
