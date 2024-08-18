import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobApplicationRepository } from './job-application.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationRepository]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController]
})
export class ApplicationModule {}
