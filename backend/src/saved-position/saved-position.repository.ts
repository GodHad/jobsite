import { Brackets, EntityRepository, getConnection, Repository } from 'typeorm';
import { SavedPosition } from './saved-position.entity';


@EntityRepository(SavedPosition)
export class SavedPositionRepository extends Repository<SavedPosition> {
  async getTransactionConnection (): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return {connection, queryRunner}
  }
}
