import { Module, Global } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RabbitConsumer } from './rabbit.consumer';
import { LogActivityModule } from '../log_activities/log_activities.module';

import { UsersModule } from '../users/users.module';
import { TransactionModule } from '../transaction/transaction.module'; //! TransactionModule

@Global()
@Module({
  imports: [LogActivityModule, UsersModule, TransactionModule],
  providers: [RabbitService, RabbitConsumer],
  exports: [RabbitService],
})
export class RabbitModule {}
