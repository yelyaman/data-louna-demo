import { Module } from '@nestjs/common';
import { SkinService } from './skin.service';
import { Skin } from 'src/entities/skin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Skin])],
  providers: [SkinService],
  exports: [SkinService]
})
export class SkinModule { }
