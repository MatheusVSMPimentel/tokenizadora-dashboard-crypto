import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { CoinPoolService } from '../services/coin-pool.service';
import { CoinValueInfo } from '../dto/response/coin-value-info.dto';
import { Coin } from '../entities/coin.entity';
import { CoinValue } from '../schemas/coin-value.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository, In, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinService } from '../services/coin.service';

@WebSocketGateway({
  cors: {
    origin: ['*', 'https://piehost.com', 'http://localhost:8081', 'extension://mdmlhchldhfnfnkfmljgeinlffmdgkjo/index.html'], 
    methods: ['GET', 'POST'],
    //transports: ['websocket'],
  },
})
export class CoinWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(CoinWebSocketGateway.name);
  private clientSubscriptions: Map<string, Set<string>> = new Map(); 

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly coinService: CoinService,
    private readonly poolService: CoinPoolService,
    @InjectModel(CoinValue.name) private coinModel: Model<CoinValue>,
    @InjectRepository(Coin) private readonly coinRepository: Repository<Coin>,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.clientSubscriptions.set(client.id, new Set());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    const subscriptions = this.clientSubscriptions.get(client.id);
    if (subscriptions) {
      subscriptions.forEach((symbol) => {
        this.poolService.releaseConnection(symbol);
      });
      this.clientSubscriptions.delete(client.id);
    }
  }

  @SubscribeMessage('subscribe-to-crypto')
async handleSubscription(client: Socket, payload: { symbol: string }): Promise<void> {
  try {
    const { symbol } = payload;

    // Validação do payload
    if (!symbol || typeof symbol !== 'string') {
      this.logger.error(`Subscrevendo com símbolo inválido: ${symbol}`);
      client.emit('error', { message: 'Símbolo inválido.' });
      return;
    }

    const symbolUpper = symbol.toUpperCase();
    this.logger.log(`Cliente ${client.id} solicitou subscrição para ${symbolUpper} via Coinbase`);

    const clientSubscriptions = this.clientSubscriptions.get(client.id) || new Set();
    clientSubscriptions.add(symbolUpper);
    this.clientSubscriptions.set(client.id, clientSubscriptions);

    // Obtenha a conexão externa utilizando o serviço de pool
    const connection = this.poolService.getConnection(symbolUpper);

    connection.on('message', async (data: string) => {
      const message = JSON.parse(data);
      if (message.TYPE === '2' && message.FROMSYMBOL === symbolUpper && message.PRICE) {
        const price: number = message.PRICE;
        const openDay: number = message.OPENDAY || undefined;
        // Upsert CoinValue usando o CoinService; supondo que ele retorna uma instância completa
        const coinValue = await this.coinService.upsertCoinValue(symbolUpper, price, openDay);

        // Obtém a entidade Coin para montar os dados completos (nome, imagem, etc.)
        const coinEntity = await this.coinRepository.findOneByOrFail({ symbol: symbolUpper });

        // Construa o payload usando o método CoinValueBuilder
        const responsePayload = CoinValueInfo.CoinValueBuilder(coinEntity, coinValue);

        // Envia o payload para o cliente
        client.emit('crypto-update', responsePayload);
      }
    });
  } catch (error) {
    this.logger.error(`Erro na subscrição: ${error.message}`);
    client.emit('error', { message: 'Erro interno na subscrição.' });
  }
}

}
