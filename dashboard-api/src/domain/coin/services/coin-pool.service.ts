import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasePoolService } from '../../shared/services/base-pool.service';
import * as WebSocket from 'ws';

@Injectable()
export class CoinPoolService extends BasePoolService<string, WebSocket> {
  private readonly apiKey: string;
  constructor(private readonly configService: ConfigService) {
    super();
    this.apiKey = this.configService.get<string>('API_KEY') ?? "";
    if (!this.apiKey) {
      throw new Error('API_KEY não encontrada no ambiente.');
    }
  }
  createConnection(key: string): WebSocket {
    const ccUrl = `wss://streamer.cryptocompare.com/v2?api_key=${this.apiKey}`;
    const ccStreamer = new WebSocket(ccUrl);

    ccStreamer.on('open', () => {
      this.logger.log(`Conexão com CryptoCompare aberta para ${key}`);
      const subRequest = {
        action: 'SubAdd',
        subs: [`2~Coinbase~${key}~USD`],
      };
      ccStreamer.send(JSON.stringify(subRequest));
    });

    ccStreamer.on('message', (data: string) => {
      this.logger.log(`Dados recebidos para ${key}: ${data}`);
    });

    ccStreamer.on('error', (err) => {
      this.logger.error(`Erro na conexão com CryptoCompare para ${key}: ${err}`);
    });

    ccStreamer.on('close', () => {
      this.logger.log(`Conexão com CryptoCompare fechada para ${key}`);
    });

    return ccStreamer;
  }

  protected closeConnection(connection: WebSocket): void {
    connection.close();
    this.logger.log('Conexão WebSocket encerrada.');
  }
}
