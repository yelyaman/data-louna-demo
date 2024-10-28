import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SkinportService } from './skinport.service';
import { UserModule } from '../user/users.module';
import { SkinportController } from './skinport.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    UserModule,
  ],
  controllers: [SkinportController],
  providers: [SkinportService],
  exports: [SkinportService],
})
export class SkinportModule {}
