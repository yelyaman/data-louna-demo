import { Injectable } from '@nestjs/common';

@Injectable()
export class SkinportService {
  getHello(): string {
    return 'Hello World!';
  }
}
