import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    forbidNonWhitelisted:true,
    whitelist: true
  }))
  const config = new DocumentBuilder()
  .setTitle("Article Project")
  .setDescription("article project for lesson")
  .setVersion("1.0.0")
  .addBearerAuth() 
  .build()
  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("docs",app,document)
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(`Root api for project: http://localhost:${PORT}`,);
    console.log(`Root api for swagger: http://localhost:${PORT}/docs`,);
    
    
  });
}
bootstrap();
