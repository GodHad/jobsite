// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
//
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();



import * as dotenv from 'dotenv';
dotenv.config()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from "@nestjs/common";

import { NestExpressApplication } from "@nestjs/platform-express";
import { CustomValidationFilter } from './common/filters/custom-validation.filter';

import * as helmet from 'helmet';


import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  const logger = new Logger('bootstrap');
  const port = process.env.PORT
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new CustomValidationFilter());

  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.set('trust proxy', 1);
  app.use(helmet())

  app.enableCors({
    origin: true,
    // origin: [domainConfig.frontend],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    exposedHeaders:['X-XSRF-TOKEN']
  });
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
