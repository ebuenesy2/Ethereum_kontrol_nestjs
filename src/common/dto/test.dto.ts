import { IsNotEmpty, IsString } from 'class-validator';

export class TestDto {
  @IsNotEmpty({ message: 'Boş Olamaaz' })
  @IsString({ message: 'String Olacak' })
  name: string;

  @IsNotEmpty({ message: 'Boş Olamaaz' })
  @IsString({ message: 'String Olacak' })
  surname: string;
}
