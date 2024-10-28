import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkinTransaction } from 'src/entities/transaction.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(SkinTransaction)
    private skinTransactionRepository: Repository<SkinTransaction>,
  ) {}

  async create(
    body: Pick<SkinTransaction, 'totalAmount' | 'paymentMethod'>,
    manager?: EntityManager,
  ) {
    const repository = manager
      ? manager.getRepository(SkinTransaction)
      : this.skinTransactionRepository;
      
    return repository.save(body);
  }
}
