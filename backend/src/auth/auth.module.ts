import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LinkedinStrategy } from "./strategy/linkedin.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import * as config from "config"
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { JwtStrategy } from "./strategy/jwt.strategy";
const jwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({  secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn:jwtConfig.expiresIn,
      },
    }), TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [AuthService, LinkedinStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [
    LinkedinStrategy,JwtStrategy
  ]

})
export class AuthModule {}
