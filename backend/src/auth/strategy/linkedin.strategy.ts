import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayoad } from '../dto/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/user.repository';
import * as config from "config";
import { Request } from "express";
import { Strategy, VerifyCallback } from 'passport-linkedin-oauth2';

@Injectable()

export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin'){
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ){
    // super({
    //   // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
    //     return request?.cookies?.authToken;
    //   }]),
    //   secretOrKey: process.env.JWT_SECRET
    // });
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: process.env.BACK_END_BASE_URL+"/auth/linkedin/callback",
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }


  async validate(accessToken: string, refreshToken: string, payload: any, done: VerifyCallback) {
    const { id, provider, name, displayName, photos, emails } = payload;
    const { givenName, familyName } = name;
    const { value:photoUrl } =  photos[0];
    const [{value:email}] = emails;

    let user:any = await this.userRepository.findOne({ linkedinId: id });
    if (!user){
      // throw new UnauthorizedException();
      const newUser = await this.userRepository.create({
        email:email,
        linkedinId: id,
        firstname: givenName,
        lastname: familyName,
        linkedinPhotoUrl: photoUrl,

      })
      await this.userRepository.save(newUser)
      user = await this.userRepository.findOne({ linkedinId: id });
    } else {
      user.linkedinPhotoUrl = photoUrl;
      await this.userRepository.save(user)
    }

    const adminLinkedinIds = process.env.ADMIN_LINKEDIN_IDS.split(',')
    if(adminLinkedinIds.includes(id)){
      user.admin = true;
    }

    return user;
  }
}
