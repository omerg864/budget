import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import morgan from 'morgan';
import { API_ROUTES } from '../../shared/constants/routes.constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix(API_ROUTES.BASE);

  app.use(morgan('dev'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
