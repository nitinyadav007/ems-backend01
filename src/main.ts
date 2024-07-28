import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new TcpExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(2529);
  console.log('Service running successfully');
}

bootstrap();
