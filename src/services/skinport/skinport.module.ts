import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SkinportService } from './skinport.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [SkinportService],
})
export class SkinportModule {}
