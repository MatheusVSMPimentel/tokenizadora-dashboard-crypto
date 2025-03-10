// src/crypto/services/polling-update.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CoinService } from './coin.service';
import { ICoinApi } from 'src/domain/external-data/coin.api.inteface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PollingUpdateService {
  private readonly logger = new Logger(PollingUpdateService.name);
  // Conjunto de símbolos (em maiúsculas) a serem atualizados via polling
  private symbolsToUpdate = new Set<string>();

  constructor(
    private readonly coinService: CoinService,
    @Inject('ICoinApi') private readonly cryptoApiService: ICoinApi,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  addSymbol(symbol: string): void {
    const symbolUpper = symbol.toUpperCase();
    this.symbolsToUpdate.add(symbolUpper);
    this.logger.log(`Símbolo ${symbolUpper} adicionado para atualização por polling.`);
  }

  removeSymbol(symbol: string): void {
    const symbolUpper = symbol.toUpperCase();
    if (this.symbolsToUpdate.has(symbolUpper)) {
      this.symbolsToUpdate.delete(symbolUpper);
      this.logger.log(`Símbolo ${symbolUpper} removido da atualização por polling.`);
    }
  }

  // Executa a cada 5 segundos
  @Cron(CronExpression.EVERY_5_SECONDS)
  async updateSymbols() {
    if (this.symbolsToUpdate.size === 0) return;
    this.logger.log(`Polling update para: ${Array.from(this.symbolsToUpdate).join(", ")}`);
    for (const symbol of this.symbolsToUpdate) {
      try {
        const symbolUpper = symbol.toUpperCase();
        const data = await this.cryptoApiService.getCryptoValue(symbolUpper);
        if (!data.RAW || data.Message) {
          this.logger.error(`Erro na atualização via polling para ${symbolUpper}`);
          continue;
        }
        const usdData = data.RAW[symbolUpper].USD;
        const coinValue = await this.coinService.upsertCoinValue(symbolUpper, usdData.PRICE, usdData.OPENDAY);
        // Emite um evento global, que pode ser ouvido pelo Gateway para fazer o broadcast aos clientes
        const payload = {
          symbol: symbolUpper,
          price: coinValue.price,
          percentualChange: coinValue.percentDifference,
        };
        this.eventEmitter.emit('crypto.update', payload);
        this.logger.log(`Polling update para ${symbolUpper}: ${JSON.stringify(payload)}`);
      } catch (error) {
        this.logger.error(`Erro no polling para ${symbol}: ${error.message}`);
      }
    }
  }
}
