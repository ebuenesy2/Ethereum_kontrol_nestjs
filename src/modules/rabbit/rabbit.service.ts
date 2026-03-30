import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import {
  ChannelModel,
  Connection,
  ConfirmChannel,
  ConsumeMessage,
} from 'amqplib';
import { RabbitMessage } from '../../common/interface/rabbit-message.interface';

@Injectable()
export class RabbitService implements OnModuleInit {
  private connection!: Connection;
  private channel!: ConfirmChannel;

  private readonly logger = new Logger(RabbitService.name);
  private readonly queueName =
    process.env.RABBITMQ_QUEUE ?? 'main_queue_sabit_v1';
  private readonly dlqName = `${this.queueName}_dlq`;
  private readonly rabbitUrl =
    process.env.RABBITMQ_URLS ?? 'amqp://guest:guest@localhost:5672';

  async onModuleInit(): Promise<void> {
    await this.initRabbit();
  }

  async initRabbit(): Promise<void> {
    try {
      // connect() -> ChannelModel döner
      const channelModel: ChannelModel = await amqp.connect(this.rabbitUrl);

      // Connection buradan alınır
      const connection: Connection = channelModel.connection;
      this.connection = connection;

      // Channel yine ChannelModel üzerinden açılır
      const channel: ConfirmChannel = await channelModel.createConfirmChannel();
      this.channel = channel;

      // DLQ
      await this.channel.assertQueue(this.dlqName, { durable: true });

      // Main Queue
      await this.channel.assertQueue(this.queueName, {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: this.dlqName,
      });

      this.logger.log('RabbitMQ bağlantısı kuruldu');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
      this.logger.error('[RabbitMQ] initRabbit failed', message);
      throw new Error(message);
    }
  }

  async publish(
    action: RabbitMessage['action'],
    payload: RabbitMessage['payload'],
    ip?: string,
    userAgent?: string,
    fullUrl?: string,
  ): Promise<boolean> {
    if (!this.channel) await this.initRabbit();

    const message: RabbitMessage = {
      action,
      payload,
      meta: {
        ip: ip ?? '',
        userAgent: userAgent ?? '',
        fullUrl: fullUrl ?? '',
      },
    };

    return new Promise<boolean>((resolve, reject) => {
      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
        (err) => {
          if (err instanceof Error) {
            this.logger.error(err.message);
            reject(err);
            return;
          }
          this.logger.log(`Message published: ${message.action}`);
          resolve(true);
        },
      );
    });
  }

  async consume<TPayload>(
    handler: (msg: RabbitMessage<TPayload>) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) await this.initRabbit();

    await this.channel.consume(
      this.queueName,
      (msg: ConsumeMessage | null) => {
        if (!msg) return;

        void (async () => {
          try {
            const content = JSON.parse(
              msg.content.toString('utf-8'),
            ) as RabbitMessage<TPayload>;

            await handler(content);
            this.channel.ack(msg);
          } catch (err: unknown) {
            this.channel.nack(msg, false, false);

            if (err instanceof Error) {
              this.logger.error(`Consume error: ${err.message}`);
            } else {
              this.logger.error(`Consume error bilinmeyen tip`);
            }
          }
        })();
      },
      { noAck: false },
    );
  }
}
