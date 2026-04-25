import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter ());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Article Project")
    .setDescription("article project for lesson")
    .setVersion("1.0.0")
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const PORT = process.env.PORT ? +process.env.PORT : 3000;
  await app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/docs`);
  });
}
bootstrap();