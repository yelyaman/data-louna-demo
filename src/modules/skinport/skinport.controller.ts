import { Controller, Get, Query } from '@nestjs/common';
import { SkinportService } from './skinport.service';
import { GetMinimumPricesForItemsDto } from './skinport.dto';

@Controller('skinport')
export class SkinportController {
  constructor(private readonly skinportService: SkinportService) {}

  @Get('get-minimim-prices')
  getMinimumPricesForItem(
    @Query() queryParams: GetMinimumPricesForItemsDto,
  ): Promise<object> {
    return this.skinportService.getMinimumPricesForItems(queryParams);
  }
}
