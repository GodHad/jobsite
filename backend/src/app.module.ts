import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionModule } from './position/position.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ApplicationModule } from './application/application.module';
import { SavedPositionService } from './saved-position/saved-position.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "../config/typeorm.config";
import { ConfigModule } from "@nestjs/config";
import { SavedPositionModule } from './saved-position/saved-position.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({isGlobal: true}),
    PositionModule, AuthModule, UserModule, ApplicationModule, SavedPositionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
