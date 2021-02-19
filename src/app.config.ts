import { TypeOrmModule } from '@nestjs/typeorm';

const dbConfig = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'beer-game',
  password: 'beer-game',
  database: 'beer-game',
  autoLoadEntities: true,
  synchronize: true, // todo should not be used in production, it can end lossing data
});

export default dbConfig;
