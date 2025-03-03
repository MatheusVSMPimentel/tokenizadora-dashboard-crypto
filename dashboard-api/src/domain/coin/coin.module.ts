// src/crypto/crypto.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './entities/coin.entity';
import { CoinListScheduler } from './coin-list.scheduler';
import { CoinListService } from './services/coin-list.service';
import { CoinController } from './coin.controller';
import { CoinService } from './services/coin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';
import { ConfigService } from '@nestjs/config';
import { CoinApiService } from 'src/infrastructure/external-data/coin.api.service';
import { CoinValue, CoinValueSchema } from './schemas/coin-value.schema';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Coin]),
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: CoinValue.name, schema: CoinValueSchema },
    ]),
  ],
  controllers: [CoinController],
  providers: [
    {
      provide: 'ICoinApi', // Token para identificação
      useClass: CoinApiService,
    },
    ConfigService,
    CoinApiService,
    CoinService,
    CoinListService,
    CoinListScheduler,
  ],
  exports: ['ICoinApi', CoinService],
})
export class CoinModule {}
