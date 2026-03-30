import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class sabitDto {
  @IsNotEmpty({ message: 'Bu Alan Boş Bırakılamaz' })
  @IsString({ message: 'Bu Alan Zorunlu Olarak String Olmalıdır' })
  not: string;

  @IsOptional()
  @IsNumber({}, { message: 'Bu Alan Zorunludur' })
  user_id?: number;

  @IsOptional()
  @Type(() => Date) // 🔥 string → Date dönüşümü
  @IsDate({ message: 'birthDate geçerli bir tarih olmalıdır' })
  birthDate?: Date;
}
