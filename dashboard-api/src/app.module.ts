import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoinModule } from './domain/coin/coin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoinApiService } from './infrastructure/external-data/coin.api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') ?? "", 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity.js' ], // '/../**/*.entity{.ts,.js}'
        synchronize: true,  // just for experimental purpose
        options: {
          encrypt: false,                   // defina como true se sua conexão exigir
          enableArithAbort: true,
        }, 
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        console.log('MONGO_URI:', uri); // Para debug: deve imprimir mongodb://mongo:27017/nest
        return {uri: uri}
      }, 
      inject: [ConfigService],
    }),
    AuthModule,
    HttpModule, CoinModule, 
  ],
  providers: [CoinApiService, ConfigService],
  controllers: [],
  exports: [CoinApiService],
})
export class AppModule {}
