import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionApplicationDto } from './dto/create-position-application.dto';
import {promises as fs} from 'fs';
import * as uniqid from "uniqid"

import { JobApplication } from './job-application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationRepository } from './job-application.repository';
import * as config from "config"
import { MoreThan } from 'typeorm';

const fileDirConfig = config.get("fileDir")

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(JobApplicationRepository)
    private jobApplicationRepository:JobApplicationRepository,
  ){}

  async createApplication(user, positionId, createPositionApplicationDto: CreatePositionApplicationDto, file: Express.Multer.File) {

    if (new Date(user.subscribeEndDate).getTime() < new Date().getTime())
      throw new ConflictException('Your subscription has expired. Please renew your subscription to continue.');
    if (user.subscribeType === 'option1')
      throw new ConflictException('You can\'t use this function. Please upgrade your subscription to continue.');

    let fileName;

    const { connection, queryRunner } = await this.jobApplicationRepository.getTransactionConnection();
    try {

      const jobApplication = await queryRunner.manager
        .getRepository(JobApplication).createQueryBuilder("jobApplication")
        .useTransaction(true).setLock("pessimistic_write")
        .where(`jobApplication.userId = :userId`, {userId: user.id})
        .andWhere(`jobApplication.positionId = :positionId`, {positionId})
        .getOne();
      if (jobApplication) throw new ConflictException("You have already submitted an application for this position")


      if (file){
        if ( !`application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*,
      application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow
      `.includes(file.mimetype) ) throw new ConflictException("Invalid file type")
        else if (file.size > 10000000) throw new ConflictException("Invalid file size, maximum allowed is 10MB")

        fileName = uniqid()+"-"+file.originalname.trim()
        // await fs.writeFile(process.env.PWD+fileDirConfig+fileName, Buffer.from(file.buffer));
      } else if (!user.resumeFileName && !file) throw new ConflictException("CV field is empty")


      const jobApplicationRecord = await queryRunner.manager.create(JobApplication, {
        userId: user.id,
        positionId: positionId,
        firstname: createPositionApplicationDto.firstname&&createPositionApplicationDto.firstname,
        lastname: createPositionApplicationDto.lastname&&createPositionApplicationDto.lastname,
        email: createPositionApplicationDto.email&&createPositionApplicationDto.email,
        resumeFileName: fileName&&fileName || user.resumeFileName,
        coverLetter: createPositionApplicationDto.coverLetter&&createPositionApplicationDto.coverLetter,
        linkedinProfile: createPositionApplicationDto.linkedinProfile&&createPositionApplicationDto.linkedinProfile,
        website: createPositionApplicationDto.website&&createPositionApplicationDto.website.trim(),
        processing: true
      });

      file&&fileName&& await fs.writeFile(process.env.PWD+fileDirConfig+fileName, Buffer.from(file.buffer));

      await queryRunner.manager.save(jobApplicationRecord);
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

  async getUserJobApplications(user) {
    const jobApplications = await this.jobApplicationRepository.find({
      where: {userId: user.id},
      order: {createdAt: 'DESC'},
      relations: ['position']
    })
    return {data: jobApplications}
  }


  async adminGetAllJobApplications() {
    const jobApplications = await this.jobApplicationRepository.find({
      where: {id: MoreThan(0)},
      order: {createdAt: 'DESC'}
    })
    return {data: jobApplications}
  }

  async adminDownloadCV(res, jobApplicationId) {
    const jobApplication: JobApplication = await this.jobApplicationRepository.findOne(jobApplicationId)
    if (!jobApplication) throw new NotFoundException()
    res.download(process.env.PWD+fileDirConfig+jobApplication.resumeFileName)
  }

  async adminProcessedJobApplication(res, jobApplicationId) {
    const jobApplication: JobApplication = await this.jobApplicationRepository.findOne(jobApplicationId)
    if (!jobApplication) throw new NotFoundException();
    await this.jobApplicationRepository.update({id: jobApplicationId}, {processing: false});
    res.status(200).json({message: 'success'});
  }
}
