import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAuthUserDto } from "./dto/update-auth-user.dto";
import { JobApplication } from '../application/job-application.entity';
import { User } from './user.entity';
import { SavedPosition } from '../saved-position/saved-position.entity';
import * as uniqid from "uniqid"
import {promises as fs} from 'fs';
import * as config from "config"
const fileDirConfig = config.get("fileDir")

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
  ){}


  async getAuthUser(user: any) {
    const {
      id, email, firstname, lastname, linkedinPhotoUrl: photoUrl, linkedinProfileUrl,
      resumeFileName, coverLetter, website
    } = user;

    return {  id, email, firstname, lastname, photoUrl, admin: user.admin, linkedinProfileUrl, resumeFileName, coverLetter, website }
  }

  async downloadAuthUserCV(res, user: any) {
    res.download(process.env.PWD+fileDirConfig+user.resumeFileName)
  }

  async updateAuthUser(user, updateAuthUserDto: UpdateAuthUserDto, file) {
    const { connection, queryRunner } = await this.userRepository.getTransactionConnection();
    try {

      const userRecord = await queryRunner.manager
        .getRepository(User).createQueryBuilder("user")
        // .useTransaction(true).setLock("pessimistic_write")
        .where(`user.id = :userId`, {userId: user.id})
        .getOne();

      if (file){
        if ( !`application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*,
      application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow
      `.includes(file.mimetype) ) throw new ConflictException("Invalid file type")
        else if (file.size > 10000000) throw new ConflictException("Invalid file size, maximum allowed is 10MB")

        const fileName = uniqid()+"-"+file.originalname.trim()
        await fs.writeFile(process.env.PWD+fileDirConfig+fileName, Buffer.from(file.buffer));
        userRecord.resumeFileName = fileName;
      } else if (!userRecord.resumeFileName && !file) throw new ConflictException("CV field is empty")

      userRecord.firstname = updateAuthUserDto.firstname;
      userRecord.lastname = updateAuthUserDto.lastname;
      userRecord.email = updateAuthUserDto.email;
      userRecord.coverLetter = updateAuthUserDto.coverLetter;
      userRecord.website = updateAuthUserDto.website;
      userRecord.linkedinProfileUrl = updateAuthUserDto.linkedinProfile;
      await queryRunner.manager.save(userRecord)
      await queryRunner.commitTransaction()
    } catch (error){
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    } finally {
      await queryRunner.release();
    }


  }

  async adminGetAllUsers(user, getUserFilterDto) {
    const [users, count] = await this.userRepository.findAndCount({
      // where: { name: getUserFilterDto.sortBy },
      order: { [getUserFilterDto.sortBy]: "DESC" }
    })
    return users;
  }

  async adminDeleteUserById(user, userId) {
    let userRecord:any = await this.userRepository.findOne(userId)
    if (userRecord.id===user.id) throw new ConflictException("Not possible to delete your own user")

    const { connection, queryRunner } = await this.userRepository.getTransactionConnection();
    try {

      await queryRunner.manager.delete(User, { id: userId });
      await queryRunner.manager.delete(JobApplication, { userId: userId });
      await queryRunner.manager.delete(SavedPosition, { userId: userId });

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
}
