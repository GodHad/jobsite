import { Brackets, EntityRepository, getConnection, Repository } from 'typeorm';

import { Position } from "./position.entity";


@EntityRepository(Position)
export class PositionRepository extends Repository<Position> {
  async getTransactionConnection (): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return {connection, queryRunner}
  }
}
