import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayoad } from '../dto/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/user.repository';
import * as config from "config";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository
  ){
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.authToken;
      }]),
      secretOrKey: process.env.JWT_SECRET
    });
  }


  async validate(payload: JwtPayoad) {
    const { id } = payload;
    const user:any = await this.UserRepository.findOne({ id });
    if (!user){
      throw new UnauthorizedException();
    }

    const adminLinkedinIds = process.env.ADMIN_LINKEDIN_IDS.split(',')

    if(adminLinkedinIds.includes(user.linkedinId)){
      user.admin = true;
    }

    return user;
  }
}
