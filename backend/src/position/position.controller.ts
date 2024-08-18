import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
  Delete,
  UseInterceptors, UploadedFile, ConflictException,
} from '@nestjs/common';
import { AdminGuard } from "../auth/guard/admin.guard";
import { GetUser } from "../user/get-user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { PositionService } from "./position.service";
import { CreatePositionDto } from "./dto/create-position.dto";
import { PositionsFilterDto } from "./dto/positions-filter.dto";
import { GetPositionsFilterDto } from './dto/get-positions-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from '../auth/guard/optional-auth-guard';

@Controller('/')
// @UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({transform: true}))
export class PositionController {
  constructor(
    private positionService: PositionService,
  ) {}
  @Get('/position')
  async getRecentPositions(@GetUser() user, @Query() getPositionsFilterDto: GetPositionsFilterDto){
    return await this.positionService.getRecentPositions(getPositionsFilterDto)
  }


  @Get('/position/params')
  async getPositionParams(@GetUser() user){
    return await this.positionService.getPositionParams()
  }

  @Get('/position/:id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPositionById(@GetUser() user, @Param("id") id){
    return await this.positionService.getPositionById(user, id)
  }


  @Get('/system/position/params')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminGetPositionParams(@GetUser() user){
    return await this.positionService.adminGetPositionParams()
  }

  @Post('/system/position')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminCreatePosition(@GetUser() user, @Body() createPositionDto: CreatePositionDto){
    return await this.positionService.adminCreatePosition(createPositionDto)
  }
  @Post('/system/position/bulk')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async adminCreatePositionBulk(@UploadedFile() file: Express.Multer.File){
    // if (file.mimetype!=='text/csv') throw new ConflictException('File must be a CSV')
    return await this.positionService.adminCreatePositionBulk(file)
  }

  @Put('/system/position')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminUpdatePosition(@GetUser() user, @Body() createPositionDto: CreatePositionDto){
    return await this.positionService.adminUpdatePosition(createPositionDto)
  }

  @Get('/system/positions')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminGetAllPositions(@GetUser() user, @Query() positionFilterDto: PositionsFilterDto){
    return await this.positionService.adminGetAllPositions(user, positionFilterDto)
  }

  @Get('/system/position/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminGetPositionById(@GetUser() user, @Param('id') positionId){
    return await this.positionService.adminGetPositionById(user, positionId)
  }

  @Delete('/system/position/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async adminDeletePositionById(@GetUser() user, @Param('id') positionId){
    return await this.positionService.adminDeletePositionById(user, positionId)
  }
}
