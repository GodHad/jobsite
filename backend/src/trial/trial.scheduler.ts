import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrialService } from './trial.service';  // Adjust the import path as needed

@Injectable()
export class TrialScheduler {
    constructor(private readonly trialService: TrialService) { }

    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // async handleCron() {
    //     try {
    //         console.log('Running scheduled task at midnight');
    //         const trials = await this.trialService.findAllActiveTrials();
    //         for (const trial of trials) {
    //             if (await this.trialService.isTrialExpired(trial.id)) {
    //                 await this.trialService.updateTrialStatus(trial.id);
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error running scheduled task:', error);
    //     }
    // }
}
