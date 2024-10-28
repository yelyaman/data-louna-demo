import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balance.entity';
import { SkinTransaction } from 'src/entities/transaction.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(SkinTransaction)
        private skinTransactionRepository: Repository<SkinTransaction>
    ) { }

    async create(body: { totalAmount: number, payment_method: string }, manager?: EntityManager) {
        const repository = manager ? manager.getRepository(SkinTransaction) : this.skinTransactionRepository;

        const transaction = repository.create(body)
        return repository.save(transaction)
    }
}
