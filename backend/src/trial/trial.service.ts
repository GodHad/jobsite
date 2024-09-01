import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trial } from "./trial.entity";
import { User } from "src/user/user.entity";
import { TrialRepository } from "./trial.repository";

@Injectable()
export class TrialService {
    constructor(
        @InjectRepository(TrialRepository)
        private trialRepository: TrialRepository,
    ) { }

    async createTrial(user: User, optionType: string): Promise<Trial> {
        const trial = new Trial();
        trial.optionType = optionType;
        trial.startDate = new Date();
        trial.endDate = this.calculateEndDate(7);
        trial.userEmail = user.email;
        return this.trialRepository.save(trial);
    }

    calculateEndDate(days: number): Date {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        return endDate;
    }

    async findTrialByUserAndOption(userEmail: string, optionType: string): Promise<Trial> {
        const trial = await this.trialRepository.findOne({
            where: {
                userEmail,
                optionType
            }
        });

        return trial;
    }

    async findAllActiveTrials(): Promise<Trial[]> {
        const trials = await this.trialRepository.find();
        return trials;
    }

    async isTrialExpired(userEmail, optionType): Promise<boolean> {
        const trial = await this.trialRepository.findOne({
            where: {
                userEmail,
                optionType
            }
        });

        if (!trial) {
            return false;
        }

        const currentDate = new Date();

        this.updateTrialStatus(trial.id, currentDate > trial.endDate)
        if (trial.status === 'expired') return true;
        return currentDate > trial.endDate;
    }

    async terminateTrial(userEmail: string, optionType: string) {
        const trial = await this.trialRepository.update(
            {
                userEmail,
                optionType
            }, {
                status: 'expired'
            }
        )
    }

    async updateTrialStatus(trialId: number, expired: boolean): Promise<Trial> {
        const trial = await this.trialRepository.findOne(trialId);
        if (!trial) {
            throw new Error('Trial not found');
        }

        if (expired) {
            trial.status = 'expired';
            return await this.trialRepository.save(trial);
        }

        return trial;
    }
}