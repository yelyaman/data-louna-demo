import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { UsersModule } from '../users/users.module';
import { PurchaseController } from './purchase.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { SkinModule } from '../skin/skin.module';
import { BalanceModule } from '../balance/balance.module';
import { Purchase } from 'src/entities/purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    UsersModule,
    TransactionModule,
    SkinModule,
    PurchaseModule,
    BalanceModule
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService]
})
export class PurchaseModule { }