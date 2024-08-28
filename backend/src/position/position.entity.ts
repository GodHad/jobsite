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
  BeforeInsert, ValueTransformer, BeforeUpdate, AfterLoad, Index,
} from 'typeorm';
import { IsBoolean, IsEmail, IsNumber, IsNumberString, IsOptional, validateOrReject } from "class-validator";
import * as moment from "moment"
import { CompanyIndustryEnum } from "./enum/company-industry.enum";
import { JobLocationEnum } from "./job-location.enum";
import { JobApplication } from 'src/application/job-application.entity';
import { SavedPosition } from 'src/saved-position/saved-position.entity';

@Entity()
export class Position extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ fulltext: true })
  @Column()
  jobTitle: string;
  // @Column({nullable:false, type: "enum", enum: JobLocationEnum})
  @Column()
  jobLocation: string;

  @Index({ fulltext: true })
  @Column()
  jobDescription: string;
  // @Column()
  // jobRequirements: string;
  @Index({ fulltext: true })
  @Column()
  companyName: string;
  @Column()
  companySize: string;
  // @Column({nullable:false, type: "enum", enum: CompanyIndustryEnum})
  @Index({ fulltext: true })
  @Column()
  companyIndustry: string;

  @Index({ fulltext: true })
  @Column()
  companyAbout: string;

  @Column({nullable: true})
  companyImageUrl: string;
  // @Column()
  // publishDate: string;

  @Column({nullable:true})
  jobExternalUrl: string;
  @Column({nullable:true, default: "internal"})
  jobApplicationType:string;


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

  @OneToMany(() => JobApplication, jobApplication => jobApplication.position)
  jobApplications: JobApplication[];

  @OneToMany(() => SavedPosition, savedPosition => savedPosition.position)
  savedPositions: SavedPosition[];
}