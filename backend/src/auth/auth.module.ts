import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LinkedinStrategy } from "./strategy/linkedin.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import * as config from "config"
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './strategy/google.strategy';
const jwtConfig = config.get('jwt')

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({  secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn:'1d',
      },
    }), TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [AuthService, LinkedinStrategy, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [
    LinkedinStrategy,JwtStrategy, AuthService
  ]

})
export class AuthModule {}
