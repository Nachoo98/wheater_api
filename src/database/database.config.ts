import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  autoLoadEntities: true,
  synchronize: process.env.MYSQL_DATABASE === 'true',
  dropSchema: process.env.MYSQL_DATABASE === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['src/database/migrations/**/*.{ts,js}'],
  legacySpatialSupport: false,
});
