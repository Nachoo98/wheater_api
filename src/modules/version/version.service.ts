import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { environments } from 'src/config/config.module';

@Injectable()
export class VersionService {
  constructor(
    @Inject(environments.KEY)
    private readonly configService: ConfigType<typeof environments>,
  ) {}

  getDate(): string {
    return this.configService.APP_VERSION;
  }
}
