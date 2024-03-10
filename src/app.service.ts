import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const helloWorld = 'Hello World!';
    return helloWorld;
  }
}
