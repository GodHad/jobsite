import { Controller, Post, Body, Param } from '@nestjs/common';
import { TrialService } from './trial.service';
import { User } from '../user/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';

@Controller('trials')
export class TrialController {
  constructor(private readonly trialService: TrialService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createTrial(
    @GetUser() user,
    @Body() body: {optionType: string},
  ) {
    return this.trialService.createTrial(user, body.optionType);
  }

  
}
