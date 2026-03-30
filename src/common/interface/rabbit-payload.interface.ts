import { RabbitEnum } from '../enum/rabbit-action';

export interface RabbitPayload {
  jobId?: string;
  created_byId?: number;

  customer_number?: string;
  Guid?: string;

  status?: string;
  statusJob?: RabbitEnum;
  requestedTime?: number;
  requestedAt?: string;

  id?: number;
  scanner_status?: string;
  scanner_statusJob?: RabbitEnum;
  scanner_time?: number;
  scanner_date?: string;

  type?: string;
  type_dbid?: number;
}
