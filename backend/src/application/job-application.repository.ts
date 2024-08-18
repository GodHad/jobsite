import { Brackets, EntityRepository, getConnection, Repository } from 'typeorm';


import { JobApplication } from './job-application.entity';


@EntityRepository(JobApplication)
export class JobApplicationRepository extends Repository<JobApplication> {
  async getTransactionConnection (): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return {connection, queryRunner}
  }
}
