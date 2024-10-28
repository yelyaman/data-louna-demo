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
    body: { totalAmount: number; paymentMethod: string },
    manager?: EntityManager,
  ) {
    const repository = manager
      ? manager.getRepository(SkinTransaction)
      : this.skinTransactionRepository;

    const transaction = repository.create(body);
    return repository.save(transaction);
  }
}
