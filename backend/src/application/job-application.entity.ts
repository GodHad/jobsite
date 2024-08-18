import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  BeforeInsert, ValueTransformer, BeforeUpdate, AfterLoad
} from "typeorm";
import { validateOrReject } from "class-validator";
import * as moment from "moment";


@Entity()
export class JobApplication extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @Column()
  positionId: number;

  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  email: string;
  @Column()
  resumeFileName: string;
  @Column()
  coverLetter: string;
  @Column()
  linkedinProfile: string;
  @Column({nullable: true})
  website: string;



  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsertActions() {
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async validate(): Promise<void> {
    await validateOrReject(this);
  }

  @AfterLoad()
  afterLoad(){
    // this.createdAt = moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss') as unknown as Date;
    // this.updatedAt = moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss') as unknown as Date;
  }


}
