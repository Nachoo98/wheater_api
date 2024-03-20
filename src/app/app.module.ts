import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Modules } from 'src/modules/modules';
import ConfigModule from '../config/config.module';
import TypeOrmModule from 'src/database/database.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    Modules,
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor() {}

  async onApplicationBootstrap(): Promise<void> {
    return;
  }
}
