import { RabbitEnum } from '../enum/rabbit-action';
import { RabbitMeta } from './rabbit-meta.interface';

export interface RabbitMessage<TPayload = unknown> {
  action: RabbitEnum;
  payload: TPayload;
  meta: RabbitMeta;
}
