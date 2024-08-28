import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert, ValueTransformer, BeforeUpdate, AfterLoad,
  ManyToOne
} from "typeorm";
import { validateOrReject } from "class-validator";
import * as moment from "moment";
import { Position } from "src/position/position.entity";

@Entity()
export class SavedPosition extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @Column()
  positionId: number;


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
    this.createdAt = moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss') as unknown as Date;
    this.updatedAt = moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss') as unknown as Date;
  }

  @ManyToOne(() => Position, position => position.savedPositions)
  position: Position;

}