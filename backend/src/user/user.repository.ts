import { Brackets, EntityRepository, getConnection, Repository } from 'typeorm';
import { User } from './user.entity';



@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getTransactionConnection (): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return {connection, queryRunner}
  }

}
