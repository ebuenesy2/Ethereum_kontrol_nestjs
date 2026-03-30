// transaction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from '../../common/entities/transaction.entity';

import { LogActivityController } from '../../modules/log_activities/log_activities.controller';
import { LogActivityModule } from '../../modules/log_activities/log_activities.module';
import { SocketModule } from '../socket/socket.module'; //! Socket
import { CustomerGateway } from '../socket/customer.gateway'; //! Socket

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]), // TransactionEntity repository sağlanıyor
    LogActivityModule, // LogActivityService inject için
    SocketModule, //! Socket
  ],
  providers: [TransactionService, CustomerGateway],
  controllers: [LogActivityController],
  exports: [TransactionService, CustomerGateway], // DI için export
})
export class TransactionModule {}
