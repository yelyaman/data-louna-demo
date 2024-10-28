import { Body, Controller, Post, Request } from '@nestjs/common';
import { PurchaseService as PurchaseService } from './purchase.service';
import { BuySkinDto } from './purchase.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) { }

  @Post()
  buySkin(@Body() body: BuySkinDto, @Request() req) {
    return this.purchaseService.buySkin(req.user, body);
  }
}
