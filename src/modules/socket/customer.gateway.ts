//src/modules/socket/customer.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CustomerGateway {
  @WebSocketServer()
  server: Server;

  //! Customer
  emitAdd(customer: any) {
    this.server.emit('customer:add', customer);
  }

  emitUpdate(customer: any) {
    this.server.emit('customer:update', customer);
  }

  emitDelete(customer: any) {
    this.server.emit('customer:delete', customer);
  }

  //! Transaction
  emitTransactionAdd(transaction: any) {
    this.server.emit('transaction:add', transaction);
  }

  emitTransactionUpdate(transaction: any) {
    this.server.emit('transaction:update', transaction);
  }

  emitTransactionDelete(transaction: any) {
    this.server.emit('transaction:delete', transaction);
  }
}
