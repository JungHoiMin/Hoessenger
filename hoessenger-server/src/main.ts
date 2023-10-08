import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as firebase from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const firebaseCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseCredentials),
  });

  await app.listen(3000);
}
bootstrap();
