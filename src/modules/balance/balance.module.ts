import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance])],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
