import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as config from "config"
import { CreatePositionDto } from "./dto/create-position.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { PositionRepository } from "./position.repository";
import { PositionsFilterDto } from "./dto/positions-filter.dto";
import { Position } from './position.entity';
import { pseudoRandomBytes } from 'crypto';
const jobsConfig = config.get("job")
const companyIndustries = jobsConfig.companyIndustries;
const jobLocations = jobsConfig.location

import * as moment from "moment"
import { GetPositionsFilterDto } from './dto/get-positions-filter.dto';
import { ILike, In, MoreThan, Raw } from 'typeorm';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';
import { JobApplication } from '../application/job-application.entity';
import { User } from '../user/user.entity';
import { SavedPosition } from '../saved-position/saved-position.entity';
import { filter } from 'rxjs';


@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionRepository)
    private positionRepository:PositionRepository,
  ){}

  async getPositionParams() {
    return {
      companyIndustries, jobLocations
    }
  }

  async adminGetPositionParams() {
    return {
      companyIndustries, jobLocations
    }
  }

  async adminCreatePosition(createPositionDto: CreatePositionDto) {
    const {
      jobTitle, jobLocation,
      jobDescription, jobRequirements, companyName, companySize,
      companyIndustry, companyAbout, publishDate, companyImageUrl,
      jobApplicationType, jobExternalUrl
    }:any = createPositionDto;
    const record = await this.positionRepository.create({
      jobTitle, jobLocation,
      jobDescription, companyImageUrl,
      // jobRequirements,
      companyName, companySize,
      companyIndustry, companyAbout,
      jobApplicationType, jobExternalUrl
      // publishDate,
    });

    await this.positionRepository.save(record)
  }

  async adminGetAllPositions(user, { sortBy, page=1, page_size=10, sortDirection }: PositionsFilterDto) {
    sortBy = sortBy === "publishDate" && "createdAt" || sortBy

    const skip = (page * page_size) - page_size;
    const [positions, itemsCount] = await this.positionRepository.findAndCount({
      // where: { name: getUserFilterDto.sortBy },
      order: { [sortBy]: sortDirection },
      skip, take: page_size
    })

    const firstPageLink = `/system/positions?sortBy=createdAt&sortDirection=DESC&page=1&page_size=${page_size}`;
    const previousPageLink = page - 1 < 1? null: `/system/positions?sortBy=createdAt&sortDirection=DESC&page=${page-1}&page_size=${page_size}`;
    const lastPageNumber = Math.ceil(itemsCount/page_size) || 1
    const nextPageLink = page + 1 > lastPageNumber? null : `/system/positions?sortBy=createdAt&sortDirection=DESC&page=${page+1}&page_size=${page_size}`;


    return {
      data: positions,
      "_metadata":
        {
          "page": page,
          "page_size": page_size,
          "page_count": Math.ceil(itemsCount/page_size),
          "total_count": itemsCount,
          "links": [
            {"self": `/system/positions?sortBy=createdAt&sortDirection=DESC&page=${page}&page_size=${page_size}`},
            {"first": firstPageLink},
            {"previous": previousPageLink},
            {"next": nextPageLink},
            {"last": `/system/positions?sortBy=createdAt&sortDirection=DESC&page=${lastPageNumber}&page_size=${page_size}`},
          ]
        },



    };
  }

  async adminGetPositionById(user, positionId) {
    const position = await this.positionRepository.findOne(positionId)
    if (!position) throw new NotFoundException()
    return position;
  }

  async adminUpdatePosition(createPositionDto: CreatePositionDto) {
    const {
      jobTitle, jobLocation,
      jobDescription, jobRequirements, companyName, companySize,
      companyIndustry, companyAbout, publishDate, companyImageUrl,
      jobApplicationType, jobExternalUrl
    }:any = createPositionDto;

    let position:any = await this.positionRepository.findOne(createPositionDto.id)

    if (!position) throw new NotFoundException()

    position = {
      ...position,
      jobTitle, jobLocation,
      jobDescription, jobRequirements, companyName, companySize,
      companyIndustry, companyAbout, publishDate, companyImageUrl,
      jobApplicationType, jobExternalUrl
    }
    await this.positionRepository.save(position)
  }

  async adminDeletePositionById(user, positionId) {
    const { connection, queryRunner } = await this.positionRepository.getTransactionConnection();
    try {
      await queryRunner.manager.delete(Position, { id: positionId });
      await queryRunner.manager.delete(JobApplication, { positionId: positionId });
      await queryRunner.manager.delete(SavedPosition, { positionId: positionId });

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

  async getRecentPositions({companySize, jobTitle, publishDate, companyIndustry, jobLocation, page_size=10, page=1}:GetPositionsFilterDto) {
    try {
      if (!page_size)
        page_size = 10;
      if (!page)
        page = 1;

      const skip = (page * page_size) - page_size;
      let stringWhereQuery = ""

      const filters:any = [];
      const array:any = [];

      if (jobTitle&&jobTitle!='null'&&jobTitle!='all'&&jobTitle!=''){
        filters.push({ jobTitle : ILike(`%${jobTitle.toLowerCase()}%`) })
        // filters.push({ jobDescription : ILike(`%${jobTitle.toLowerCase()}%`) })
      }
      if (jobLocation&&jobLocation!='null'&&jobLocation!='all'&&jobLocation!='') {

        if (filters.length > 0) {

          filters[0].jobLocation = ILike(`%${jobLocation.toLowerCase()}%`);
          // filters[1].jobLocation = ILike(`%${jobLocation.toLowerCase()}%`);
        }
        else filters.push({jobLocation : ILike(`%${jobLocation.toLowerCase()}%`) })
      }

      if (companyIndustry&&companyIndustry!='null'&&companyIndustry!='all'&&companyIndustry!='') {
        if (filters.length >= 1) filters[0].companyIndustry = ILike(`%${companyIndustry.toLowerCase()}%`);
        else filters.push({ companyIndustry: ILike(`%${companyIndustry.toLowerCase()}%`)  })
        if (filters.length >= 2) filters[1].companyIndustry = ILike(`%${companyIndustry.toLowerCase()}%`);
      }


      let [jobs, itemsCount] = await this.positionRepository.findAndCount({
        where: filters,
        order: { ["id"]: "DESC" },
        skip, take: page_size
      });
      const parsedJobs = jobs.map((position) => {

        return position;
      })

      const distinctJobTitle = (await this.positionRepository.createQueryBuilder("position")
        .select('DISTINCT ("jobTitle")')
        .orderBy('position.jobTitle', 'ASC')
        .getRawMany()).map((item) => {
        return item.jobTitle
      });




      const firstPageLink = `/position?sortBy=createdAt&sortDirection=DESC&page=1&page_size=${page_size}&jobTitle=${jobTitle}&publishDate=${publishDate}&companyIndustry=${companyIndustry}&jobLocation=${jobLocation}`;
      const previousPageLink = page - 1 < 1? null: `/position?sortBy=createdAt&sortDirection=DESC&page=${page-1}&page_size=${page_size}&jobTitle=${jobTitle}&publishDate=${publishDate}&companyIndustry=${companyIndustry}&jobLocation=${jobLocation}`;
      const lastPageNumber = Math.ceil(itemsCount/page_size) || 1
      const nextPageLink = page + 1 > lastPageNumber? null : `/position?sortBy=createdAt&sortDirection=DESC&page=${page+1}&page_size=${page_size}&jobTitle=${jobTitle}&publishDate=${publishDate}&companyIndustry=${companyIndustry}&jobLocation=${jobLocation}`;
      return {
        // distinctCompanyIndustry, distinctCompanySize,
        distinctJobTitle,
        // distinctJobLocation,

        data: parsedJobs,
        filterData: {
          jobTitle,  companyIndustry, jobLocation,
        },
        "_metadata":
          {
            "page": page,
            "page_size": page_size,
            "page_count": Math.ceil(itemsCount/page_size),
            "total_count": itemsCount,
            "links": [
              {"self": ``},
              {"first": firstPageLink},
              {"previous": previousPageLink},
              {"next": nextPageLink},
              {"last": `/position?sortBy=createdAt&sortDirection=DESC&page=${lastPageNumber}&page_size=${page_size}&jobTitle=${jobTitle}&publishDate=${publishDate}&companyIndustry=${companyIndustry}&jobLocation=${jobLocation}`},
            ]
          },
      };
    } catch (error){
      console.log(error)
      throw new ConflictException(error.message)
    }
  }
  async getFieldsFromCSVFile(file): Promise<any[]>{
    const results: any[] = [];
    const readable = new Readable()
    readable._read = () => {} // _read is required but you can noop it
    readable.push(file.buffer)
    readable.push(null)

    return new Promise((res, rej) => {
      readable
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          res(results)
        })
        .on('error', (error) => {
          rej(error)
        })
    })
  }


  async adminCreatePositionBulk(file: Express.Multer.File) {
    const csvFields = await this.getFieldsFromCSVFile(file)

    const { connection, queryRunner } = await this.positionRepository.getTransactionConnection();
    try {
      for (const csvField of csvFields){
        const position = {
          jobTitle: csvField.title&&csvField.title.trim().replace('\n', ''),
          jobLocation: csvField.location&&csvField.location.trim().replace('\n', ''),
          jobDescription: csvField.jobDescription&&csvField.jobDescription.trim().replace('\n', ''),
          companyName: csvField.companyName&&csvField.companyName.trim().replace('\n', ''),
          companySize: csvField.companySize&&csvField.companySize.trim().replace('\n', ''),
          companyIndustry: csvField.companyIndustry&&csvField.companyIndustry.trim().replace('\n', ''),
          companyAbout: csvField.companyAbout&&csvField.companyAbout.trim().replace('\n', ''),
          jobExternalUrl: csvField.jobExternalUrl&&csvField.jobExternalUrl.trim().replace('\n', ''),
          jobApplicationType: "external",
        }
        const positionRecord = await queryRunner.manager.create('Position', position)
        await queryRunner.manager.save(positionRecord)
      }
      await queryRunner.commitTransaction()
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message)
    } finally {
      await queryRunner.release();
    }


  }

  async getPositionById(user, id) {
    const data: any = await this.positionRepository.findOne(id);
    if (!data) throw new NotFoundException()
    data.createdAt = moment(data.createdAt).fromNow()
    if (!user) return {data}

    let jobApplication;
    let savedPosition;
    const { connection, queryRunner } = await this.positionRepository.getTransactionConnection();
    try {
      jobApplication = await queryRunner.manager
        .getRepository(JobApplication).createQueryBuilder("jobApplication")
        .useTransaction(false)
        // .setLock("pessimistic_write")
        .where(`jobApplication.userId = :userId`, {userId: user.id})
        .andWhere(`jobApplication.positionId = :positionId`, {positionId: id})
        .getOne();
      savedPosition = await queryRunner.manager
        .getRepository(SavedPosition).createQueryBuilder("savedPosition")
        .useTransaction(false)
        // .setLock("pessimistic_write")
        .where(`savedPosition.userId = :userId`, {userId: user.id})
        .andWhere(`savedPosition.positionId = :positionId`, {positionId: id})
        .getOne();

      await queryRunner.commitTransaction();
    }
    catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    }
    finally {
      await queryRunner.release();
      return {data, applied: jobApplication? true : false, saved: savedPosition? true : false}

    }



  }
}
