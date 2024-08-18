import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const isProduction = process.env.NODE_ENV==="production"||process.env.DB_NODE_ENV==="production";
let configObject;
if (isProduction) {
   configObject = {
    host: process.env.DB_HOST ,
    port: Number(process.env.DB_PORT),
    username:process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
  }
} else {
  let dbConfig = config.get('db');
   configObject = {
    host:  dbConfig.host,
    port:  dbConfig.port,
    username:  dbConfig.username,
    password:  dbConfig.password,
    database:  dbConfig.name,
  }
}

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ...configObject,
  entities: [__dirname + '/../src/**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC == 'true',
  migrations: ['migration/*.{js,ts}'],
  cli: { migrationsDir: 'migration' },
  ssl: false

  // connectTimeoutMS: 1500,
};
