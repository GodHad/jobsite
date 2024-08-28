import {
  Body, ConflictException,
  Controller, Get,
  Post, Put, Query, Req, Res, UsePipes,
  ValidationPipe, UseGuards
} from "@nestjs/common";
import { SigninCredentialsDto } from "./dto/signin-credentials.dto";
import { query, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from "../user/get-user.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}


  @Post('/logout') // Clears jwt session cookie.
  logOut(@Req() req: Request,
         @Res({ passthrough: true }) res: Response): void {
    res.cookie('authToken', {maxAge: 0});
    res.cookie('userDetails', {maxAge: 0});
    return;
  }



  // @Post('/signup') // Sign up controller
  // async signUp(@Req() req: Request,
  //              @Res({ passthrough: true }) res: Response,
  //              @Body() authCredentialsDto: SignupCredentialsDto): Promise<{ token } >{
  //
  //   return await this.authService.signUp(req, res, authCredentialsDto);
  // }

  @Post('/signin') // Sign in controller
  async signIn(@Req() req: Request,
              @Res({ passthrough: true }) res: Response,
              @Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) return res.status(500).json({message: 'failed to login'});
    this.authService.login(user, res, req);
  }

  @Get('/linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req) {}

  @Get('/linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuthRedirect(@Req() req: Request,
                     @Res({ passthrough: true }) res: Response,
                     @GetUser() user) {
    return this.authService.linkedinLogin(user, res, req)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}


  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.googleLogin(res, req)
  }

}
