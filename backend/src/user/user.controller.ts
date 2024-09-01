import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query, Res, UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from "./get-user.decorator";
import { UpdateAuthUserDto } from "./dto/update-auth-user.dto";
import { AdminGuard } from "../auth/guard/admin.guard";
import { UserFilterDto } from "./dto/user-filter.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { User } from './user.entity';

@Controller('/')
// @UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(
    private userService: UserService,
  ) {
  }

  @Get('/user')
  @UseGuards(AuthGuard('jwt'))
  async getAuthUser(@GetUser() user) {
    return await this.userService.getAuthUser(user)
  }

  @Post('/user')
  async createUser(@Body() body: { username: string; password: string; email: string, phoneNumber: string }): Promise<User> {
    return this.userService.createUser(body.username, '', body.email, body.password, body.phoneNumber)
  }

  @Put('/user')
  @UseGuards(AuthGuard('jwt'))
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAuthUser(@GetUser() user, @Body() updateAuthUserDto: UpdateAuthUserDto, @UploadedFile() file: Express.Multer.File) {
    return await this.userService.updateAuthUser(user, updateAuthUserDto, file)
  }

  @Get('/user/cv')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async downloadAuthUserCV(@GetUser() user, @Param("jobApplicationId") jobApplicationId, @Res() res: Response) {
    return await this.userService.downloadAuthUserCV(res, user)
  }

  @Post('/user/update-hitech-view')
  @UseGuards(AuthGuard('jwt'))
  async updateHiTechView(@GetUser() user, @Body() body: {hiTech: boolean}, @Res() res: Response) {
    return await this.userService.updateHiTechView(res, user, body.hiTech);
  }

  @Post('/user/active-subscribe')
  @UseGuards(AuthGuard('jwt'))
  async activeSubscription(@GetUser() user, @Body() body: {optionType: string}, @Res() res: Response) {
    return await this.userService.activeSubscription(res, user, body.optionType)
  }

  @Get('/system/users')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminGetAllUsers(@GetUser() user, @Query() getUserFilterDto: UserFilterDto) {
    return await this.userService.adminGetAllUsers(user, getUserFilterDto)
  }


  @Delete('/system/user/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminDeleteUserById(@GetUser() user, @Param('id') userId) {
    return await this.userService.adminDeleteUserById(user, userId)
  }


}