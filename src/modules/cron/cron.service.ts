import { Injectable, Logger } from '@nestjs/common';
//import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  // // -------------------------------------------------
  // // Her 1 dakikada bir çalışacak cron job
  // // -------------------------------------------------
  // @Cron('0 */1 * * * *')
  // handleCron() {
  //   const newData = {
  //     id: 1,
  //     timestamp: new Date().toISOString(),
  //     value: Math.floor(Math.random() * 100), // rastgele veri
  //   };

  //   this.logger.log(`Yeni veri eklendi: ${JSON.stringify(newData)}`);
  // }

  // // ------------------------------
  // // Her Saniye
  // // ------------------------------
  // @Cron(CronExpression.EVERY_SECOND)
  // handleEverySecond() {
  //   this.logger.log('Her saniyede çalıştı');
  // }

  // // ------------------------------
  // // Her 5 dakikada bir (dakikalık)
  // // ------------------------------
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // handleEvery5Minutes() {
  //   this.logger.log('Her 5 dakikada bir çalıştı');
  // }
}
