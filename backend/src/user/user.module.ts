import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { TrialService } from 'src/trial/trial.service';
import { TrialModule } from 'src/trial/trial.module';
import { TrialRepository } from 'src/trial/trial.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([TrialRepository]),
  ],
  providers: [UserService, TrialService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
