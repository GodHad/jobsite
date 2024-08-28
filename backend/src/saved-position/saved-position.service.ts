import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SavedPositionRepository } from './saved-position.repository';
import * as moment from "moment"
import { SavedPosition } from './saved-position.entity';
import { Position } from '../position/position.entity';

@Injectable()
export class SavedPositionService {
  constructor(
    @InjectRepository(SavedPositionRepository)
    private savedPositionRepository:SavedPositionRepository,
  ){}

  async getUserSavedPositions(user, query) {
    const page_size = query.page_size ? query.page_size : 10000
    let savedPositions;
    let data = [];
    let savedPositionsIds;
    let returnedSavedPositionsIds;
    let allSavedPositions;
    const { connection, queryRunner } = await this.savedPositionRepository.getTransactionConnection();
    try {
      savedPositions = await queryRunner.manager
        .getRepository(SavedPosition).createQueryBuilder("savedPosition")
        .useTransaction(true).setLock("pessimistic_write")
        .where(`savedPosition.userId = :userId`, {userId: 1})
        // .andWhere(`savedPosition.positionId = :positionId`, {positionId})
        .take(page_size)
        .orderBy('savedPosition.id', 'ASC')
        .getMany();
      allSavedPositions = await queryRunner.manager
        .getRepository(SavedPosition).createQueryBuilder("savedPosition")
        .leftJoinAndSelect('savedPosition.position', 'position')
        // .useTransaction(true).setLock("pessimistic_write")
        .where(`savedPosition.userId = :userId`, {userId: 1})
        .orderBy('savedPosition.id', 'ASC')
        .getMany();
      returnedSavedPositionsIds = allSavedPositions.map(item => item.positionId)
      savedPositionsIds = savedPositions.map(item => item.positionId)
      const positions = await queryRunner.manager
        .getRepository(Position).createQueryBuilder("position")
        .useTransaction(false)
        // .setLock("pessimistic_write")
        .where(`position.id IN (:...savedPositionsIds)`, {savedPositionsIds: [null, ...savedPositionsIds]})
        .getMany();
      for (const savedPosition of savedPositions){
        for (const position of positions){
          if (savedPosition.positionId === position.id){
            const formattedSavedPosition = {...savedPosition, ...position}
            formattedSavedPosition.createdAt = moment(formattedSavedPosition.createdAt).fromNow()
            data.push(formattedSavedPosition)
            delete savedPosition.id
          }
        }
      }

      await queryRunner.commitTransaction();
    }
    catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
    finally {
      await queryRunner.release();
      // return {data: data, savedPositionIds: returnedSavedPositionsIds}
      return {data: allSavedPositions, savedPositionIds: returnedSavedPositionsIds}
    }



  }

  async createSavedPosition(user, positionId) {
    const { connection, queryRunner } = await this.savedPositionRepository.getTransactionConnection();
    try {
      const savedPosition = await queryRunner.manager
        .getRepository(SavedPosition).createQueryBuilder("savedPosition")
        .useTransaction(true).setLock("pessimistic_write")
        .where(`savedPosition.userId = :userId`, {userId: user.id})
        .andWhere(`savedPosition.positionId = :positionId`, {positionId})
        .getOne();
      if (savedPosition) throw new ConflictException("Already saved!")

      const jobApplicationRecord = await queryRunner.manager.create(SavedPosition, {
        userId: user.id, positionId
      });
      await queryRunner.manager.save(jobApplicationRecord);
      await queryRunner.commitTransaction();
    }
    catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
    finally {
      await queryRunner.release();
    }
  }

  async deleteSavedPosition(user, positionId) {
    const { connection, queryRunner } = await this.savedPositionRepository.getTransactionConnection();
    try {
      await queryRunner.manager.delete(SavedPosition, { positionId: positionId, userId: user.id });
      await queryRunner.commitTransaction();
    }
    catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
    finally {
      await queryRunner.release();
    }
  }
}
