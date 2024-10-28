import { Controller, Get, Query } from '@nestjs/common';
import { SkinportService } from './skinport.service';
import { GetMinimumPrisesForItemsDto } from './skinport.dto';

@Controller('skinport')
export class SkinportController {
  constructor(private readonly skinportService: SkinportService) {}

  @Get('endpoint1')
  getMinimumPrisesForItem(
    @Query() queryParams: GetMinimumPrisesForItemsDto
  ): Promise<object> {
    return this.skinportService.getMinimumPrisesForItems(queryParams);
  }
}
