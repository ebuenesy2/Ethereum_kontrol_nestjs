import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../common/entities/users.entity';
import { UsersService } from './users.service';
import { LogActivityController } from '../../modules/log_activities/log_activities.controller';
import { LogActivityModule } from '../../modules/log_activities/log_activities.module';
import { SocketModule } from '../socket/socket.module'; //! Socket
import { CustomerGateway } from '../socket/customer.gateway'; //! Socket

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]), // UsersEntity repository sağlanıyor
    LogActivityModule, // LogActivityService inject için
    SocketModule, //! Socket
  ],
  providers: [UsersService, CustomerGateway],
  controllers: [LogActivityController],
  exports: [UsersService], // DI için export
})
export class UsersModule {}
