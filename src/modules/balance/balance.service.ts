import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from 'src/entities/balance.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BalanceService {
    constructor(
        @InjectRepository(Balance)
        private balanceRepository: Repository<Balance>
    ) { }

    async createBalance(userId: string) {
        this.balanceRepository.save({
            user: { id: userId }
        })
    }
    async getUserBalance(userId: string, manager?: EntityManager): Promise<Balance> {
        const repository = manager ? manager.getRepository(Balance) : this.balanceRepository;

        return repository.findOne({
            where: {
                user: {
                    id: userId
                }
            }
        })
    }

    async decreaseBalance(userId: string, totalAmount: number, manager?: EntityManager): Promise<Balance> {
        const repository = manager ? manager.getRepository(Balance) : this.balanceRepository
        const balance = await this.getUserBalance(userId, manager)
        if (balance.amount <= totalAmount)
            throw new BadRequestException('total more than balance')

        balance.amount -= totalAmount

        return repository.save(balance)
    }
}
