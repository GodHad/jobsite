import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Trial } from './trial.entity';
import { TrialService } from './trial.service';
import { TrialController } from './trial.controller';
import { TrialScheduler } from './trial.scheduler';
import { TrialRepository } from './trial.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrialRepository]),
    // ScheduleModule.forRoot(), // Import the ScheduleModule
  ],
  providers: [TrialService], // Register the scheduler
  controllers: [TrialController],
  exports: [TrialService]
})
export class TrialModule {}
