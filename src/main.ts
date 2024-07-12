import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(2529);
  console.log('Service running successfully');
}

bootstrap();
