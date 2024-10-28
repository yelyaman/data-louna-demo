import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserItem } from 'src/entities/user-item.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserItemService {
  constructor(
    @InjectRepository(UserItem)
    private userItemRepository: Repository<UserItem>,
  ) {}

  async addItem(body: CreateUserItemDto, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(UserItem)
      : this.userItemRepository;

    const userItem = await repository.findOne({
      where: {
        skin: { id: body.skin.id },
        user: { id: body.user.id  },
      },
    });

    if (userItem) {
      userItem.quantity += body.quantity;
      return repository.save(userItem);
    }

    return repository.save(body);
  }
}
