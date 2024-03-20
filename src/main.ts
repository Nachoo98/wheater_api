import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSecurity } from './security';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: 422,
    }),
  );

  setupSecurity(app);

  setupSwagger(app);

  await app.listen(5000);
}
bootstrap();
