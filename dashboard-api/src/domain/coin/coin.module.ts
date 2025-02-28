// src/crypto/crypto.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoinApiService } from 'src/integration/external-data/coin.api.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './entities/coin.entity';
import { CoinListScheduler } from './coin-list.scheduler';
import { CoinListService } from './services/coin-list.service';
import { CoinController } from './coin.controller';
import { CoinService } from './services/coin.service';

@Module({
  imports: [HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Coin]),],
  controllers: [CoinController],
  providers: [CoinApiService, CoinService, CoinListService, CoinListScheduler],
  exports: [CoinApiService, CoinService],
})
export class CoinModule {}
