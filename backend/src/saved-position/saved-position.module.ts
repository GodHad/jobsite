import { Module } from '@nestjs/common';
import { SavedPositionController } from './saved-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SavedPositionRepository } from './saved-position.repository';
import { SavedPositionService } from './saved-position.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedPositionRepository]),
  ],
  controllers: [SavedPositionController],
  providers: [SavedPositionService]
})
export class SavedPositionModule {}
