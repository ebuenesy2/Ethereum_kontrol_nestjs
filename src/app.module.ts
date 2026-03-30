import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';

//! Socket
import { SocketModule } from './modules/socket/socket.module';

import { UsersEntity } from './common/entities/users.entity';
import { UsersService } from './modules/users/users.service';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';

import { TransactionEntity } from './common/entities/transaction.entity';
import { TransactionService } from './modules/transaction/transaction.service';
import { TransactionController } from './modules/transaction/transaction.controller';
import { TransactionModule } from './modules/transaction/transaction.module';

import { LogActivityEntity } from './common/entities/log_activity.entity';
import { LogActivityController } from './modules/log_activities/log_activities.controller';
import { LogActivityService } from './modules/log_activities/log_activities.service';
import { LogActivityModule } from './modules/log_activities/log_activities.module';

import { RabbitModule } from './modules/rabbit/rabbit.module';
import { CronService } from './modules/cron/cron.service';

import { BlockchainController } from './modules/blockchain/blockchain.controller';
import { BlockchainService } from './modules/blockchain/blockchain.service';

import { FirebaseController } from './modules/firebase/firebase.controller';
import { FirebaseService } from './modules/firebase/firebase.service';
import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Global yaparak her yerde erişilebilir hale getiriyoruz
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          transport: {
            targets: [
              {
                target: 'pino-pretty',
                level: config.get<string>('LOG_LEVEL', 'info'),
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                  ignore: 'pid,hostname',
                },
              },
              {
                target: 'pino-roll',
                level: 'debug',
                options: {
                  file: path.join(process.cwd(), 'logs', 'app'),
                  frequency: 'daily',
                  size: '1g',
                  mkdir: true,
                  extension: '.log',
                  dateFormat: 'yyyy-MM-dd',
                },
              },
            ],
          },
          level: config.get<string>('LOG_LEVEL', 'info'),
          customLogLevel: (req, res, err) => {
            if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
            if (res.statusCode >= 500 || err) return 'error';
            if (res.statusCode >= 300 && res.statusCode < 400) return 'silent';
            return 'info';
          },
        },
        level: config.get<string>('LOG_LEVEL', 'info'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const dbUrl = process.env.DATABASE_URL;

        return {
          type: 'mysql',
          url: dbUrl,
          synchronize: false,
          entities: [UsersEntity, TransactionEntity, LogActivityEntity],
        };
      },
    }),
    TypeOrmModule.forFeature([
      UsersEntity,
      TransactionEntity,
      LogActivityEntity,
    ]),

    LogActivityModule,
    TransactionModule,
    UsersModule,
    RabbitModule,
    SocketModule,
    FirebaseModule,
  ],
  controllers: [
    UsersController,
    TransactionController,
    LogActivityController,
    BlockchainController,
    FirebaseController,
  ],
  providers: [
    UsersService,
    TransactionService,
    LogActivityService,
    CronService,
    BlockchainService,
    FirebaseService,
  ],
})
export class AppModule {}
