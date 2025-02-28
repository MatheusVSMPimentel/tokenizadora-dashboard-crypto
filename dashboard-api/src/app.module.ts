import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinApiService } from './integration/external-data/coin.api.service';
import { CoinModule } from './domain/coin/coin.module';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',                  // ou o endereço IP do seu servidor SQL Server
      port: 14444,                         // porta padrão do SQL Server
      username: 'sa',                     // exemplo de usuário
      password: 'YourStrong@Passw0rd',     // exemplo de senha
      // Carrega todas as entidades automaticamente a partir do diretório
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,                  // use apenas em desenvolvimento!
      options: {
        encrypt: false,                   // defina como true se sua conexão exigir
        enableArithAbort: true,
      },
    }),
    CoinModule
  ],
  providers: [CoinApiService],
  controllers: [],
  exports: [CoinApiService],
})
export class AppModule {}
