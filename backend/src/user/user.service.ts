import { ConflictException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as uniqid from "uniqid"
import { promises as fs } from 'fs';
import * as config from "config"
import * as bcrypt from 'bcryptjs';
import parsePhoneNumberFromString from "libphonenumber-js";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { UpdateAuthUserDto } from "./dto/update-auth-user.dto";
import { JobApplication } from '../application/job-application.entity';
import { User } from './user.entity';
import { SavedPosition } from '../saved-position/saved-position.entity';
import { TrialService } from "src/trial/trial.service";
import { TrialRepository } from "src/trial/trial.repository";

const fileDirConfig = config.get("fileDir")

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private trialRepository: TrialRepository,
    private userRepository: UserRepository,
    private readonly trialService: TrialService
  ) { }


  async getAuthUser(user: any) {
    const {
      id, email, firstname, lastname, linkedinPhotoUrl: photoUrl, linkedinProfileUrl,
      resumeFileName, coverLetter, website, phoneNumber, address, phoneCountryPrefix, hiTechView, subscribeType, subscribeEndDate, subscribeStatus
    } = user;

    return { id, email, firstname, lastname, photoUrl, admin: user.admin, linkedinProfileUrl, resumeFileName, coverLetter, website, phoneNumber, address, phoneCountryPrefix, hiTechView, subscribeType, subscribeEndDate, subscribeStatus }
  }

  async createUserByGoogle(firstname: string, lastname: string, email: string) {
    if (!(firstname + lastname) || (firstname + lastname).trim() === '') {
      throw new BadRequestException(' must not be empty');
    }
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email must not be empty');
    }

    // Create the user entity
    const user = this.userRepository.create({
      firstname,
      lastname,
      email,
    });

    // Save the user to the database
    return this.userRepository.save(user);
  }

  async createUser(firstname: string, lastname: string, email: string, password: string, phoneNumber: string): Promise<User> {
    if (!(firstname + lastname) || (firstname + lastname).trim() === '') {
      throw new BadRequestException(' must not be empty');
    }
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email must not be empty');
    }
    if (!password || password.trim() === '') {
      throw new BadRequestException('Password must not be empty');
    }
    if (!phoneNumber || phoneNumber.trim() === '') {
      throw new BadRequestException('Phone number must not be empty');
    }

    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) throw new BadRequestException('Email is already exist.');

    // Extract country prefix code from phone number (assumes phone number format like "+1234567890")
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
    if (!phoneNumberObj) {
      throw new BadRequestException('Invalid phone number format');
    }
    const countryCode = phoneNumberObj.country;
    const localNumber = phoneNumberObj.nationalNumber;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user entity
    const user = this.userRepository.create({
      firstname,
      lastname,
      password: hashedPassword,
      email,
      phoneNumber: localNumber,
      phoneCountryPrefix: countryCode
    });

    // Save the user to the database
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateHiTechView(res, user, hiTech) {
    const { connection, queryRunner } = await this.userRepository.getTransactionConnection();
    try {
      const userRecord = await queryRunner.manager
        .getRepository(User).createQueryBuilder("user")
        // .useTransaction(true).setLock("pessimistic_write")
        .where(`user.id = :userId`, { userId: user.id })
        .getOne();
      userRecord.hiTechView = hiTech;
      await queryRunner.manager.save(userRecord)
      await queryRunner.commitTransaction()
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    } finally {
      await queryRunner.release();
      return res.status(200).json({ success: 'true' })
    }
  }

  async activeSubscription(res, user, optionType) {
    const isTrialExpired = await this.trialService.isTrialExpired(user.email, optionType);
    const { queryRunner } = await this.userRepository.getTransactionConnection();

    try {
      const userRecord = await queryRunner.manager
        .getRepository(User)
        .createQueryBuilder("user")
        .where(`user.id = :userId`, { userId: user.id })
        .getOne();

      const currentDate = new Date().getTime();
      const subscribeEndDate = new Date(user.subscribeEndDate).getTime();

      if (subscribeEndDate > currentDate && user.subscribeStatus === 'trial' && user.subscribeType === 'option1' && optionType === 'option2') {
        await this.trialService.terminateTrial(user.email, 'option1');

        await this.trialService.createTrial(user, optionType);
        userRecord.subscribeType = optionType;
        userRecord.subscribeStartDate = new Date();
        userRecord.subscribeEndDate = this.trialService.calculateEndDate(7);  // New trial period for Option 2
        userRecord.subscribeStatus = 'trial';

      } else if (!isTrialExpired) {
        // Check if the user is eligible to start a new trial
        const existingTrial = await this.trialService.findTrialByUserAndOption(user.email, optionType);

        if (!existingTrial) {
          await this.trialService.createTrial(user, optionType);
          userRecord.subscribeType = optionType;
          userRecord.subscribeStartDate = new Date();
          userRecord.subscribeEndDate = this.trialService.calculateEndDate(7);
          userRecord.subscribeStatus = 'trial';
        } else {
          if (user.subscribeType === 'option2' && optionType === 'option1') return res.status(403).json({ message: 'You are currently subscribed to option 2. To switch to option 1, please complete your current subscription period.' });
          return res.status(403).json({ message: 'Your trial for this option is using now.' });
        }
      } else if (await this.setNewOptionIsAvailable(user, optionType)) {
        userRecord.subscribeType = optionType;
        userRecord.subscribeStartDate = new Date();
        userRecord.subscribeEndDate = this.trialService.calculateEndDate(30);
        userRecord.subscribeStatus = 'active';
      } else {
        const { message } = await this.getErrorMessage(user, optionType);
        return res.status(402).json({ message });
      }

      await queryRunner.manager.save(userRecord);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    } finally {
      await queryRunner.release();
    }

    return res.status(200).json({
      message: optionType === "option2"
        ? "Congratulations! Your subscription has been upgraded to 'Click to Apply'."
        : "Congratulations! You are now subscribed to receive email notifications for new job postings."
    });
  }

  async setNewOptionIsAvailable(user, optionType) {
    const currentDate = new Date().getTime();
    const subscribeEndDate = new Date(user.subscribeEndDate).getTime();
    if (optionType === 'option1') {
      if (subscribeEndDate < currentDate || user.subscribeType === null) {
        return true;
      }
    } else if (optionType === 'option2') {
      if (user.subscribeType === null || user.subscribeType === 'option1' || subscribeEndDate < currentDate) {
        return true;
      }
    }
    return false;
  }

  async getErrorMessage(user, optionType) {
    const subscribeEndDate = new Date(user.subscribeEndDate).getTime();
    const currentDate = new Date().getTime()
    const data = { message: '' };

    const validOptions = ['option1', 'option2'];
    if (!validOptions.includes(optionType)) {
      data.message = 'The selected subscription option is invalid. Please select a valid option.';
      return data;
    }
    if (optionType === user.subscribeType && subscribeEndDate > currentDate) {
      data.message = 'You are already subscribed to this option, and your subscription is still active.';
      return data;
    }
    if (user.subscribeStatus === 'trial' && user.subscribeType !== optionType) {
      data.message = 'You are currently on a trial subscription. Please complete or expire your current trial before changing options.';
      return data;
    }
    if (user.subscribeType === 'option2' && optionType === 'option1') {
      data.message = 'You are currently subscribed to option 2. To switch to option 1, please complete your current subscription period.';
      return data;
    }

    data.message = 'An unexpected error occurred. Please try again later or contact support if the issue persists.';
    return data;
  }


  async downloadAuthUserCV(res, user: any) {
    res.download(process.env.PWD + fileDirConfig + user.resumeFileName)
  }

  async updateAuthUser(user, updateAuthUserDto: UpdateAuthUserDto, file) {
    const { connection, queryRunner } = await this.userRepository.getTransactionConnection();
    try {

      const userRecord = await queryRunner.manager
        .getRepository(User).createQueryBuilder("user")
        // .useTransaction(true).setLock("pessimistic_write")
        .where(`user.id = :userId`, { userId: user.id })
        .getOne();

      if (file) {
        if (!`application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*,
      application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow
      `.includes(file.mimetype)) throw new ConflictException("Invalid file type")
        else if (file.size > 10000000) throw new ConflictException("Invalid file size, maximum allowed is 10MB")

        const fileName = uniqid() + "-" + file.originalname.trim()
        await fs.writeFile(process.env.PWD + fileDirConfig + fileName, Buffer.from(file.buffer));
        userRecord.resumeFileName = fileName;
      } else if (!userRecord.resumeFileName && !file) throw new ConflictException("CV field is empty")

      userRecord.firstname = updateAuthUserDto.firstname;
      userRecord.lastname = updateAuthUserDto.lastname;
      userRecord.email = updateAuthUserDto.email;
      userRecord.coverLetter = updateAuthUserDto.coverLetter;
      userRecord.website = updateAuthUserDto.website;
      userRecord.linkedinProfileUrl = updateAuthUserDto.linkedinProfile;
      userRecord.address = updateAuthUserDto.address;
      userRecord.phoneNumber = updateAuthUserDto.phoneNumber;
      userRecord.phoneCountryPrefix = updateAuthUserDto.phoneCountryPrefix;
      await queryRunner.manager.save(userRecord)
      await queryRunner.commitTransaction()
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(error.message);
    } finally {
      await queryRunner.release();
    }


  }

  async adminGetAllUsers(user, getUserFilterDto) {
    await this.checkSubscribeStatus();
    const [users, count] = await this.userRepository.findAndCount({
      // where: { name: getUserFilterDto.sortBy },
      order: { [getUserFilterDto.sortBy]: "DESC" }
    })
    return users;
  }

  async checkSubscribeStatus() {
    const users = await this.userRepository.find({where: {subscribeStatus: 'active'}});
    const expiredUsers = users.filter(user => new Date(user.subscribeEndDate).getTime() < new Date().getTime());

    if (expiredUsers.length > 0) {
        for (const user of expiredUsers) {
            console.log('Checking and updating subscribe status');
            user.subscribeStatus = 'expired';
            await this.userRepository.save(user);  // Save each user after updating
        }
    }
  }

  async adminDeleteUserById(user, userId) {
    let userRecord: any = await this.userRepository.findOne(userId)
    if (userRecord.id === user.id) throw new ConflictException("Not possible to delete your own user")

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
