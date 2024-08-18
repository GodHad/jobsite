import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
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

@Controller('/')
@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({transform: true}))
export class UserController {
  constructor(
    private userService: UserService,
  ) {
  }

  @Get('/user')
  async getAuthUser(@GetUser() user) {
    return await this.userService.getAuthUser(user)
  }

  @Put('/user')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAuthUser(@GetUser() user, @Body() updateAuthUserDto: UpdateAuthUserDto, @UploadedFile() file: Express.Multer.File) {
    return await this.userService.updateAuthUser(user, updateAuthUserDto, file)
  }

  @Get('/user/cv')
  @UseGuards(AdminGuard)
  async downloadAuthUserCV(@GetUser() user, @Param("jobApplicationId") jobApplicationId, @Res() res: Response){
    return await this.userService.downloadAuthUserCV(res, user)
  }

  @Get('/system/users')
  @UseGuards(AdminGuard)
  async adminGetAllUsers(@GetUser() user, @Query() getUserFilterDto: UserFilterDto) {
    return await this.userService.adminGetAllUsers(user, getUserFilterDto)
  }


  @Delete('/system/user/:id')
  @UseGuards(AdminGuard)
  async adminDeleteUserById(@GetUser() user, @Param('id') userId) {
    return await this.userService.adminDeleteUserById(user, userId)
  }


}