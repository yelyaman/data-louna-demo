import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skin } from 'src/entities/skin.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SkinService {
  constructor(
    @InjectRepository(Skin)
    private skinRepository: Repository<Skin>,
  ) {}

  async getOneById(id: string, manager?: EntityManager): Promise<Skin> {
    const repository = manager
      ? manager.getRepository(Skin)
      : this.skinRepository;

    return repository.findOne({
      where: { id },
    });
  }

  async decreaseQuantity(skin: Skin, quantity: number, manager: EntityManager) {
    const repository = manager
      ? manager.getRepository(Skin)
      : this.skinRepository;
    if (skin.quantity < quantity)
      throw new BadRequestException('Not enought skin quantity');

    skin.quantity -= quantity;

    return repository.save(skin);
  }
}
