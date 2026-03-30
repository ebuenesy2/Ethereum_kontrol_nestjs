import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogActivityEntity } from '../../common/entities/log_activity.entity';
import { LogActivityService } from './log_activities.service';
import { LogActivityController } from './log_activities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogActivityEntity])],
  providers: [LogActivityService],
  controllers: [LogActivityController],
  exports: [LogActivityService], // Diğer modüllerden çağırabilmek için
})
export class LogActivityModule {}
