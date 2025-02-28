import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT?? "", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,  // just for experimental purpose
  options: {
    encrypt: false,                   // defina como true se sua conexão exigir
    enableArithAbort: true,
  }, 
});

export default databaseConfig;
