import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private balanceService: BalanceService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async create(body: CreateUserDto): Promise<User> {
    const already = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (already) throw new BadRequestException('user already exists');

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await this.usersRepository.save({
      ...body,
      password: hashedPassword,
    });

    this.balanceService.createBalance(user.id);

    return user;
  }

  async updatePassword(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.update(
      { id: userId },
      { password: hashedPassword },
    );
  }
}
