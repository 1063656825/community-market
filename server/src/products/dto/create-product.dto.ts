import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  originalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  discountPrice: number;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsDateString()
  validDate: string;
} 