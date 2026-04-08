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

  //! Kullanıcı - Me
  async dbFind_UserMe() {
    try {
      const totalUsers = await this.usersRepo
        .createQueryBuilder('users')
        .where('users.status = 1')
        .andWhere('users.level = 3')
        .getCount();

      return {
        title: 'me',
        status: 200,
        success: true,
        totalUsers,
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
