import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { LogActivityService } from '../log_activities/log_activities.service';

import { RabbitService } from './rabbit.service';
import { RabbitEnum } from '../../common/enum/rabbit-action'; //! Rabbit Enum
import { RabbitMessage } from '../../common/interface/rabbit-message.interface';
import { RabbitPayload } from '../../common/interface/rabbit-payload.interface';

import { TransactionService } from '../transaction/transaction.service';
import { TransactionEntity } from '../../common/entities/transaction.entity';

@Injectable()
export class RabbitConsumer implements OnModuleInit {
  private readonly logger = new Logger(RabbitConsumer.name);

  constructor(
    private readonly rabbitService: RabbitService,
    private readonly logActivityService: LogActivityService,
    private readonly transactionService: TransactionService,
  ) {}

  async onModuleInit() {
    await this.rabbitService.consume<RabbitPayload>(
      async (msg: RabbitMessage<RabbitPayload>) => {
        const { payload, meta, action } = msg;

        console.log('payload:', payload);
        console.log('meta:', meta);
        console.log('action:', action);

        // --------------------------------------------------
        // Tip güvenli default değerler
        // --------------------------------------------------
        payload.status = 'processing';
        payload.statusJob = action;
        payload.requestedTime = Date.now();
        payload.requestedAt = new Date().toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul',
        });

        //const searchKey = 'jobId';
        const searchValue = payload.jobId ?? '';

        let category = 'category';

        console.log('Received message with action:', action);
        console.log('Payload:', payload);

        try {
          // --------------------------------------------------
          // Transaction işlemleri
          // --------------------------------------------------
          if (
            [
              'add_transaction',
              'edit_transaction',
              'delete_transaction',
            ].includes(action)
          ) {
            category = 'transaction';

            await this.transactionService.dbEdit_Transaction(
              searchValue,
              payload,
              meta.ip,
              meta.userAgent,
              meta.fullUrl,
            );
          }

          // --------------------------------------------------
          // Log
          // --------------------------------------------------
          await this.logActivityService.log(
            Number(payload.created_byId),
            category,
            String(payload.type),
            'rabbit',
            Number(payload.type_dbid),
            'Veri İşleme Alındı',
            meta.fullUrl ?? '',
            'POST',
            meta.ip ?? '',
            meta.userAgent ?? '',
            JSON.stringify({
              jobId: payload.jobId,
              customerNumber: payload.customer_number ?? null,
              Guid: payload.Guid ?? null,
              action,
              status: payload.status,
              statusJob: payload.statusJob,
              requestedTime: payload.requestedTime,
              requestedAt: payload.requestedAt,
            }),
          );

          // --------------------------------------------------
          // API Send işlemleri
          // --------------------------------------------------

          switch (action) {
            case RabbitEnum.ADD_TRANSACTION:
              await this.transactionService.dbAdd_Transaction(
                payload as TransactionEntity,
                meta.ip,
                meta.userAgent,
                meta.fullUrl,
              );

              break;

            case RabbitEnum.EDIT_TRANSACTION:
              await this.transactionService.dbEdit_Transaction(
                searchValue,
                payload,
                meta.ip,
                meta.userAgent,
                meta.fullUrl,
              );
              break;

            case RabbitEnum.DELETE_TRANSACTION:
              await this.transactionService.dbDelete_Transaction(
                searchValue,
                meta.ip,
                meta.userAgent,
                meta.fullUrl,
              );
              break;
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Bilinmeyen hata';
          this.logger.error({ event: 'rabbit_consumer_failed', message });
          throw new Error(message);
        }
      },
    );
  }
}
