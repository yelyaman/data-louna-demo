import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';

class PaymentInfo {
  @IsNotEmpty()
  @IsString()
  method: string;
}

export class BuySkinDto {
  @IsNotEmpty()
  @IsUUID()
  skinId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentInfo)
  paymentInfo: PaymentInfo;
}
