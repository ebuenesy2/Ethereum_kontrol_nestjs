import { Type } from 'class-transformer';
import { RabbitEnum } from '../enum/rabbit-action';
import { OptionalParameterDto_Transaction } from './transaction-parameter.dto';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class TransactionDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Id sayı olmalıdır' })
  id?: number;

  @IsOptional()
  @IsString({ message: 'type string olmalıdır' })
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'type_dbid sayı olmalıdır' })
  type_dbid?: number;

  // --------------------------------------------------
  // Zorunlu Alanlar
  // --------------------------------------------------
  @IsOptional()
  @IsString({ message: 'Status string olmalıdır' })
  status?: string;

  @IsOptional()
  @IsEnum(RabbitEnum, { message: 'Geçersiz Rabbit Action' })
  statusJob?: RabbitEnum;

  @IsOptional()
  @IsString({ message: 'Requested at string olmalıdır' })
  requestedAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Requested time sayı olmalıdır' })
  requestedTime?: number;

  // --------------------------------------------------
  // Opsiyonel Alanlar
  // --------------------------------------------------
  @IsOptional()
  @IsString({ message: 'jobId string olmalıdır' })
  jobId?: string;

  @IsOptional()
  @IsString()
  transactionId_scanner?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  transactionDate?: string;

  @IsOptional()
  @IsString()
  transactionIPAddress?: string;

  @IsOptional()
  @IsString()
  transactionCountry?: string;

  @IsOptional()
  @IsString()
  transaction_type?: string;

  @IsOptional()
  @IsString()
  customer_number?: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  customer_email?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // --------------------------------------------------
  // Sistem (client veya server set edebilir)
  // --------------------------------------------------
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  created_byId?: number;

  // --------------------------------------------------
  // Scanner
  // --------------------------------------------------
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  totalScore?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  triggeredAlarm?: string;

  // --------------------------------------------------
  // Diğer Seçenekler
  // --------------------------------------------------
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionalParameterDto_Transaction)
  optionalParameters?: OptionalParameterDto_Transaction[];

  @IsOptional()
  @IsString({ message: 'Profil Bilgileri string olmalıdır' })
  detail?: string;

  @IsOptional()
  @IsString({ message: 'Profil Bilgileri string olmalıdır' })
  profile?: string;

  // --------------------------------------------------
  // Fiyat
  // --------------------------------------------------
  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  sendAmount?: string;

  @IsOptional()
  @IsString()
  receiveAmount?: string;

  @IsOptional()
  @IsString()
  fee?: string;

  // --------------------------------------------------
  // Transaction Adres Bilgileri
  // --------------------------------------------------
  @IsOptional()
  @IsString()
  transaction_adress?: string;

  @IsOptional()
  @IsString()
  transaction_adress_control?: string;

  @IsOptional()
  @IsString()
  transaction_adress_at?: string;
}
