import { IsOptional, IsEnum, IsInt, IsNumber } from 'class-validator';
import { RabbitEnum } from '../enum/rabbit-action';
import { Type } from 'class-transformer';

export class UsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Müşteri Numarası sayı olmalıdır' })
  id?: number;

  @IsOptional()
  @IsInt()
  scanner_add?: number;

  @IsOptional()
  @IsInt()
  scanner_time?: number;

  @IsOptional()
  scanner_date?: string;

  @IsOptional()
  scanner_status?: string;

  @IsOptional()
  @IsEnum(RabbitEnum)
  scanner_statusJob?: RabbitEnum;

  @IsOptional()
  @IsInt()
  scanner_risk?: number;

  @IsOptional()
  scanner_risk_alarm?: string;
}
