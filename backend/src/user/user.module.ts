import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
