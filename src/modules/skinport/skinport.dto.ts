import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Currency } from 'src/common/enums';

export class GetMinimumPricesForItemsDto {
  @IsOptional()
  @IsNumber()
  app_id: number;

  @IsOptional()
  @IsEnum({ enum: Currency, default: Currency.EUR })
  currency: Currency;

  @IsOptional()
  @IsNumber()
  tradable: number;
}
