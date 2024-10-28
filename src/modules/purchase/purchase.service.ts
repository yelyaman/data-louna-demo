import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/auth.dto';
import { DataSource, Repository } from 'typeorm';
import { BuySkinDto } from './purchase.dto';
import { Purchase } from 'src/entities/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceService } from '../balance/balance.service';
import { SkinService } from '../skin/skin.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly balanceService: BalanceService,
    private readonly skinService: SkinService,
    private readonly transactionService: TransactionService,
    private readonly dataSource: DataSource
  ) { }

  async buySkin(user: JwtPayload, body: BuySkinDto) {
    return this.dataSource.transaction(async (manager) => {
      const skin = await this.skinService.getOneById(body.skinId, manager)

      const totalAmount = skin.price * body.quantity
      const updatedBalance = await this.balanceService.decreaseBalance(user.id, totalAmount, manager)

      this.skinService.decreaseQuantity(skin, body.quantity, manager)

      const purchase = this.purchaseRepository.create({
        user: {
          id: user.id
        },
        skinId: body.skinId,
        quantity: body.quantity,
      })

      const transaction = await this.transactionService.create({
        totalAmount: totalAmount,
        paymentMethod: body.paymentInfo.method
      }, manager)

      purchase.transaction = transaction
      await manager.save(purchase);

      return updatedBalance
    })
  }
}
