import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skin } from 'src/entities/skin.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SkinService {
    constructor(
        @InjectRepository(Skin)
        private skinRepository: Repository<Skin>
    ) { }

    async getOneById(id: string, manager?: EntityManager): Promise<Skin> {
        const repository = manager ? manager.getRepository(Skin) : this.skinRepository

        return repository.findOne({
            where: { id }
        })
    }
}
