import { Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApplicationService } from '../application/application.service';
import { GetUser } from '../user/get-user.decorator';
import { SavedPositionRepository } from './saved-position.repository';
import { SavedPositionService } from './saved-position.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('/')
@UsePipes(new ValidationPipe({transform: true}))
@UseGuards(AuthGuard('jwt'))
export class SavedPositionController {
  constructor(
    private savedPositionService: SavedPositionService,
  ) {}
  @Get('/saved-position')
  async getUserSavedPositions(@GetUser() user, @Query() query){
    return await this.savedPositionService.getUserSavedPositions(user, query)
  }
  @Post('/saved-position/:positionId')
  async createSavedPosition(@GetUser() user, @Param('positionId') positionId){
    return await this.savedPositionService.createSavedPosition(user, positionId)
  }
  @Delete('/saved-position/:positionId')
  async deleteSavedPosition(@GetUser() user, @Param('positionId') positionId){
    return await this.savedPositionService.deleteSavedPosition(user, positionId)
  }

}
