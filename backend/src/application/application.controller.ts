import {
  Body, ConflictException,
  Controller,
  Get, Param, Post,
  Query, Req, Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {Request, Response} from "express"
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../user/get-user.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePositionApplicationDto } from './dto/create-position-application.dto';

import { ApplicationService } from './application.service';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CustomValidationFilter } from 'src/common/filters/custom-validation.filter';

@Controller('/')
@UsePipes(new ValidationPipe({transform: true}))
@UseGuards(AuthGuard('jwt'))
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
  ) {}
  @Get('/job-application')
  async getUserJobApplications(@GetUser() user){
    return await this.applicationService.getUserJobApplications(user)
  }

  @Post('/position/:id/application')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(CustomValidationFilter)
  async createPositionApplication(@GetUser() user, @Body() createPositionApplicationDto: CreatePositionApplicationDto, @UploadedFile() file: Express.Multer.File, @Param('id') positionId){
    return await this.applicationService.createApplication(user, positionId, createPositionApplicationDto, file)
  }


  @Get('/system/job-application')
  @UseGuards(AdminGuard)
  async adminGetAllJobApplications(@GetUser() user){
    return await this.applicationService.adminGetAllJobApplications()
  }

  @Get('/system/job-application/:jobApplicationId')
  @UseGuards(AdminGuard)
  async adminDownloadCV(@GetUser() user, @Param("jobApplicationId") jobApplicationId, @Res() res: Response){
    return await this.applicationService.adminDownloadCV(res, jobApplicationId)
  }
  @Get('/system/job-application-processed/:jobApplicationId')
  @UseGuards(AdminGuard)
  async adminProcessedJobApplication(@GetUser() user, @Param("jobApplicationId") jobApplicationId, @Res() res: Response) {
    return await this.applicationService.adminProcessedJobApplication(res, jobApplicationId)
  }
}
