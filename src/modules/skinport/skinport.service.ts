import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ISkin } from 'src/common/interfaces/skinport.interface';
import { GetMinimumPricesForItemsDto } from './skinport.dto';
import { UserService } from '../user/users.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class SkinportService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redis: Redis,
  ) { }

  async getMinimumPricesForItems(params: GetMinimumPricesForItemsDto): Promise<object> {
    try {
      const tradable = await this.getSkins({ ...params, tradable: 1 })
      const nonTradable = await this.getSkins({ ...params, tradable: 0 })

      // если tradable.length == nonTradable.length; i = 0 ... tradable.length; nonTradable[i] == tradable[i]
      const result = []
      for (let i = 0; i < tradable.length; i++) {
        result.push({
          market_hash_name: tradable[i].market_hash_name,
          min_price_tradable: tradable[i].min_price,
          min_price_nontradable: nonTradable[i].min_price,
        })
      }

      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getSkins(params: GetMinimumPricesForItemsDto): Promise<ISkin[]> {
    const cacheKey = `${params.app_id}_${params.currency}_${params.tradable}`
    const cached = await this.redis.get(cacheKey)

    if (cached) {
      return JSON.parse(cached)
    }

    const { data } = await firstValueFrom(
      this.httpService.get<ISkin[]>(`${process.env.SKINPORT_URL}/items`, {
        params,
      }),
    );

    await this.redis.set(`${params.app_id}_${params.currency}_${params.tradable}`, JSON.stringify(data), 'EX', 300) // 5 минут

    return data;
  }
}
