//src/modules/socket/customer.modules.ts
import { Module } from '@nestjs/common';
import { CustomerGateway } from './customer.gateway';

@Module({
  providers: [CustomerGateway],
  exports: [CustomerGateway],
})
export class SocketModule {}
