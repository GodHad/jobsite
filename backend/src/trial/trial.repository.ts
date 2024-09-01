import { Brackets, EntityRepository, getConnection, Repository } from 'typeorm';
import { Trial } from './trial.entity';



@EntityRepository(Trial)
export class TrialRepository extends Repository<Trial> {
  async getTransactionConnection (): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return {connection, queryRunner}
  }

}
