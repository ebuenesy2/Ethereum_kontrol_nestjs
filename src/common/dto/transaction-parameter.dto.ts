//! customer-parameter.dto.ts
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString } from 'class-validator';

function normalizeLower(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return '';
}

function normalize(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
}

export class OptionalParameterDto_Transaction {
  @Transform(({ value }: TransformFnParams) => normalizeLower(value))
  @IsString({ message: 'key string olmalıdır' })
  key: string;

  @Transform(({ value }: TransformFnParams) => normalize(value))
  @IsString({ message: 'value string olmalıdır' })
  value: string;
}
