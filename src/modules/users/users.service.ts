//! users.service.ts
import { Logger } from 'nestjs-pino'; //! Logger Pino
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from '../../common/entities/users.entity';
import { LogActivityService } from '../log_activities/log_activities.service'; // Log

import { CustomerGateway } from '../socket/customer.gateway'; //! Socket

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: Logger,
    private readonly usersGateway: CustomerGateway,

    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,

    private readonly logActivityService: LogActivityService, //! Log
  ) {}

  //! --------- User ---------------

  //! ------------- Scanner ---------------------------------------------

  //! Scanner Çevir

  //! Kullanıcı - Me
  async dbFind_UserMe() {
    try {
      const totalUsers = await this.usersRepo
        .createQueryBuilder('users')
        .where('users.status = 1')
        .andWhere('users.level = 3')
        .getCount();

      const scannerSent = await this.usersRepo
        .createQueryBuilder('users')
        .leftJoin(
          'ms_sanctionscanner_customer',
          'scanner',
          'scanner.customer_number = users.id',
        )
        .where('users.status = 1')
        .andWhere('users.level = 3')
        .andWhere('scanner.id IS NOT NULL')
        .getCount();

      const scannerNotSent = await this.usersRepo
        .createQueryBuilder('users')
        .leftJoin(
          'ms_sanctionscanner_customer',
          'scanner',
          'scanner.customer_number = users.id',
        )
        .where('users.status = 1')
        .andWhere('users.level = 3')
        .andWhere('scanner.id IS NULL')
        .getCount();

      //! Risk Grupları

      const riskStats = await this.usersRepo
        .createQueryBuilder('users')
        .leftJoin(
          'ms_sanctionscanner_customer',
          'scanner',
          'scanner.customer_number = users.id',
        )
        .select('scanner.triggeredAlarm', 'risk')
        .addSelect('COUNT(*)', 'count')
        .where('users.status = 1')
        .andWhere('users.level = 3')
        .groupBy('scanner.triggeredAlarm')
        .getRawMany();

      return {
        title: 'me',
        status: 200,
        success: true,
        totalUsers,
        scannerSent,
        scannerNotSent,
        riskStats,
      };
    } catch (error) {
      const ErrorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      console.error('User fetch error:', ErrorMessage);

      return {
        title: 'Kullanıcı Hatası',
        status: 500,
        success: false,
        message: 'Kullanıcı verileri alınırken hata oluştu',
        time: new Date().getTime(),
        error: ErrorMessage,
      };
    }
  } //! Kullanıcı - Me -- Son
}
