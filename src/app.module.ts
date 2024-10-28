import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkinportModule } from './modules/skinport/skinport.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { Balance } from './entities/balance.entity';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { Skin } from './entities/skin.entity';
import { SkinTransaction } from './entities/transaction.entity';
import { UserItem } from './entities/user-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_DOCKER_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_ROOT_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      entities: [User, Balance, Purchase, SkinTransaction, Skin, UserItem],
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    SkinportModule,
    PurchaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
