import { Injectable, UnauthorizedException, Logger, ConflictException, ForbiddenException  } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { SigninCredentialsDto } from "./dto/signin-credentials.dto";
import { SignupCredentialsDto } from "./dto/signup-credentials.dto";
import { JwtService } from '@nestjs/jwt';
import { JwtPayoad } from "./dto/jwt-payload.interface";
import { query, Request, Response } from "express";

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
    private jwtService: JwtService,
  ){ }


  async linkedinLogin(user, res, req) {
    const id = user.id;
    const payload: JwtPayoad = { id };
    const token = await this.jwtService.sign(payload, {expiresIn:'7d'});
    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)

    res.cookie('authToken', token, { maxAge: 3600000 * 24, httpOnly: true });

    if (req.cookies.next) res.redirect(process.env.FRONT_END_BASE_URL+req.cookies.next)
    else res.redirect(process.env.FRONT_END_BASE_URL+'/')
  }
}
