import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { API_ROUTES } from '../../shared/constants/routes.constants.js';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix(API_ROUTES.BASE);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
