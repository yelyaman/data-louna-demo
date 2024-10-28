import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkinTransaction } from 'src/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkinTransaction])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
