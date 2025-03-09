import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { CoinListService } from './services/coin-list.service';

@Injectable()
export class CoinListScheduler  {
  private readonly logger = new Logger(CoinListScheduler.name);

  constructor(private readonly coinListService: CoinListService) {}

  @Timeout(0)
  @Interval(86400000)
  async updateCoinListInterval() {
    this.logger.log('Interval job: Atualizando a lista de moedas a cada 24 horas...');
    await this.coinListService.updateCoinListInDatabase();
  }
}
