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

@Module({
  imports: [HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Coin]),],
  controllers: [CoinController],
  providers: [{
    provide: 'ICoinApi', // O token usado para identificar o provider
    useClass: CoinService,   // A classe concreta que implementa a interface
  }, CoinService, CoinListService, CoinListScheduler],
  exports: ['ICoinApi', CoinService],
})
export class CoinModule {}
