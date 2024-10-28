import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.APP_PORT || 3000;
  await app.listen(port, () => {
    console.log(`App started on PORT:${port}`);
  });
}
bootstrap();
