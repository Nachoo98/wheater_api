import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeCaseStrategy } from 'src/common/strategy/snake_case.strategy';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3000,
  username: 'root',
  password: 'secret_password',
  database: 'wheater_api',
  namingStrategy: new SnakeCaseStrategy(),
  autoLoadEntities: true,
  synchronize: true,
};
