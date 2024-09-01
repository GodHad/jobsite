import { Injectable, UnauthorizedException, Logger, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { SigninCredentialsDto } from "./dto/signin-credentials.dto";
import { SignupCredentialsDto } from "./dto/signup-credentials.dto";
import { JwtService } from '@nestjs/jwt';
import { JwtPayoad } from "./dto/jwt-payload.interface";
import { query, Request, Response } from "express";
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly userService: UserService
  ) { }


  async linkedinLogin(user, res, req) {
    const id = user.id;
    const payload: JwtPayoad = { id };
    const token = await this.jwtService.sign(payload, { expiresIn: '7d' });
    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)

    res.cookie('authToken', token, { maxAge: 3600000 * 24, httpOnly: true });

    if (req.cookies.next) res.redirect(process.env.FRONT_END_BASE_URL + req.cookies.next)
    else res.redirect(process.env.FRONT_END_BASE_URL + '/')
  }

  async googleLogin(res, req) {
    if (req.user) {
      const { firstName: firstname, lastName: lastname, email } = req.user;
      let user = await this.userService.findOneByEmail(email);
      if (!user) user = await this.userService.createUserByGoogle(firstname, lastname, email);
  
      const id = user.id;
      const payload: JwtPayoad = { id };
      const token = await this.jwtService.sign(payload, { expiresIn: '7d' });
      this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)
  
      res.cookie('authToken', token, { maxAge: 3600000 * 24, httpOnly: true });
  
      if (req.cookies.next) return res.redirect(process.env.FRONT_END_BASE_URL + req.cookies.next)
    }

    return res.redirect(process.env.FRONT_END_BASE_URL + '/')
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      if (typeof user.password !== 'string') {
        return {error: 'Password is wrong!', success: false}
      }
      if (await bcrypt.compare(password, user.password)) {
        const { ...result } = user;
        return {...result, success: true};
      } else {
        return {error: 'Password is wrong!', success: false}
      }
    } else {
      return {error: 'User does not exist!', success: false}
    }
    
  }

  async login(user: any, res: Response, req: Request) {
    // Exclude sensitive data like password from the payload
    const payload = { email: user.email, id: user.id };

    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`);

    // Sign the JWT token
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Set the token in the cookie with correct expiration time
    res.cookie('authToken', token, {
      maxAge: 3600000 * 24 * 7, // 7 days in milliseconds
      httpOnly: true,
    });

    // Redirect the user
    const redirectUrl = req.cookies.next
      ? `${process.env.FRONT_END_BASE_URL}${req.cookies.next}`
      : `${process.env.FRONT_END_BASE_URL}/`;

    this.logger.debug(`Redirecting to ${redirectUrl}`);

    return res.status(200).json({ redirectUrl, message: 'Success to login.' })
  }
}
