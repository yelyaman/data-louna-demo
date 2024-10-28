import { Module } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserItem } from 'src/entities/user-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserItem])],
  providers: [UserItemService],
  exports: [UserItemService]
})
export class UserItemModule {}
