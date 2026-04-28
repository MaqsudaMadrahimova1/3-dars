import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './module/auth/auth.module';
import { ArticleModule } from './module/article/article.module';
import { Auth } from './module/auth/entities/auth.entity';
import { Article } from './module/article/entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from './tag/tag.module';
import { Tag } from './tag/entities/tag.entity';


@Module({
  imports: [ConfigModule.forRoot({envFilePath:".env",isGlobal:true}),
    TypeOrmModule.forRoot({
      type:"postgres",
      host:"127.0.0.1",
      port:5432,
      username:"postgres",
      database:String(process.env.DB_NAME as string),
      password:String(process.env.DB_PASSWORD as string),
      entities:[Auth,Article, Tag],
      synchronize:true,
      logging:false

    }),
    AuthModule,
    ArticleModule,
    TagModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
