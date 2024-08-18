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
import { IsBoolean, IsEmail, IsNumber, IsNumberString, IsOptional, validateOrReject } from "class-validator";
import * as moment from "moment-timezone"

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique:true})
  @IsEmail()
  email:string;
  @Column()
  linkedinId:string;
  @Column({nullable:true})
  firstname:string;
  @Column({nullable:true})
  lastname:string;
  @Column()
  linkedinPhotoUrl: string;
  @Column({nullable: true})
  linkedinProfileUrl: string;

  @Column({unique: true, nullable: true})
  resumeFileName: string;
  @Column({nullable: true})
  coverLetter: string;
  @Column({nullable: true})
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
    // this.createdAt = moment(this.createdAt).tz("Asia/Jerusalem").format('YYYY-MM-DD HH:mm:ss') as unknown as Date;
    // this.updatedAt = moment(this.updatedAt).tz("Asia/Jerusalem").format('YYYY-MM-DD HH:mm:ss') as unknown as Date;
  }


}