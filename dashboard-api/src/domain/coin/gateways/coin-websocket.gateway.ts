// src/crypto/gateways/coin-websocket.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { CoinPoolService } from '../services/coin-pool.service';
import { CoinValueInfo } from '../dto/response/coin-value-info.dto';
import { Coin } from '../entities/coin.entity';
import { CoinService } from '../services/coin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PollingUpdateService } from '../services/polling-update.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['*', 'https://piehost.com', 'http://localhost:8081'],
    methods: ['GET', 'POST'],
  }
})
export class CoinWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(CoinWebSocketGateway.name);
  // Armazena, por cliente, a moeda ativa atual (via WS)
  private clientActiveSymbol: Map<string, string> = new Map();
  private clientSubscriptions: Map<string, Set<string>> = new Map();
  private globalSymbolCount: Map<string, number> = new Map();

  @WebSocketServer() server: Server;

  constructor(
    private readonly coinService: CoinService,
    private readonly poolService: CoinPoolService,
    @InjectRepository(Coin) private readonly coinRepository: Repository<Coin>,
    private readonly pollingUpdateService: PollingUpdateService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // Escuta o evento global de polling para emitir atualizações para os clientes
    this.eventEmitter.on('crypto.update', (payload: any) => {
      // Aqui, para simplificar, fazemos broadcast para todos os clientes
      // Em uma implementação real, você pode filtrar somente os clientes interessados
      this.server.emit('crypto-update', payload);
      this.logger.log(`[Polling] Emitindo update para ${payload.symbol}: ${JSON.stringify(payload)}`);
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    const subscriptions = this.clientSubscriptions.get(client.id);
    if (subscriptions) {
      subscriptions.forEach((symbol) => {
        // Decrementa o contador global para cada símbolo
        const currentCount = this.globalSymbolCount.get(symbol) || 0;
        if (currentCount <= 1) {
          this.globalSymbolCount.delete(symbol);
          // Remove esse símbolo do serviço de polling
          this.pollingUpdateService.removeSymbol(symbol);
          this.poolService.releaseConnection(symbol.toUpperCase());

        } else {
          this.globalSymbolCount.set(symbol, currentCount - 1);
        }
      });
      this.clientSubscriptions.delete(client.id);
    }
  }

  @SubscribeMessage('subscribe-to-crypto')
async handleSubscription(client: Socket, payload: { symbol: string }): Promise<void> {
  try {
    const { symbol } = payload;
    if (!symbol || typeof symbol !== 'string' || symbol.trim() === "") {
      this.logger.error(`Subscrevendo com símbolo inválido: ${symbol}`);
      client.emit('error', { message: 'Símbolo inválido.' });
      return;
    }

    const symbolUpper = symbol.toUpperCase();
    this.logger.log(`Cliente ${client.id} solicita subscrição para ${symbolUpper}`);

    // Inicializa ou atualiza as assinaturas para o cliente
    const subscriptions = this.clientSubscriptions.get(client.id) || new Set();
    subscriptions.add(symbolUpper);
    this.clientSubscriptions.set(client.id, subscriptions);

    // Atualize o contador global para esse símbolo
    const previousCount = this.globalSymbolCount.get(symbolUpper) || 0;
    this.globalSymbolCount.set(symbolUpper, previousCount + 1);
    const activeSymbol = this.clientActiveSymbol.get(client.id);
    if (!activeSymbol) {
      // Registra essa moeda como ativa para WS.
      this.clientActiveSymbol.set(client.id, symbolUpper);
      
      // Obtém a conexão do pool
      const connection = this.poolService.getConnection(symbolUpper);

      // Crie uma fila para processar mensagens sequencialmente:
      const messageQueue: string[] = [];
      let processing = false;

      function delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      async function processQueue() {
        processing = true;
        while (messageQueue.length > 0) {
          const data = messageQueue.shift() ?? "";
          const message = JSON.parse(data);
          if (
            !message ||
            message.TYPE === '429' ||
            (message.TYPE === '500' && message.MESSAGE && message.MESSAGE.includes('INVALID_SUB'))
          ) {
            // Em caso de erro, notifique para polling e encerre o processamento
            this.logger.error(`Erro recebido para ${symbolUpper}: ${JSON.stringify(message)}`);
            this.poolService.releaseConnection(symbolUpper);
            this.pollingUpdateService.addSymbol(symbolUpper);
            client.emit('info', { message: `A moeda ${symbolUpper} será atualizada via polling.` });
            break;
          }
          if (message.TYPE === '2' && message.FROMSYMBOL === symbolUpper && message.PRICE) {
            const price: number = message.PRICE;
            const openDay: number = message.OPENDAY || undefined;
            const coinValue = await this.coinService.upsertCoinValue(symbolUpper, price, openDay);
            const coinEntity = await this.coinRepository.findOneByOrFail({ symbol: symbolUpper });
            const payload = CoinValueInfo.CoinValueBuilder(coinEntity, coinValue);
            client.emit('crypto-update', payload);
          }
          await delay(1000); // Pausa de 1 segundo entre processamentos 
        }
        processing = false;
      }

      // Registre o listener para adicionar mensagens na fila:
      connection.on('message', (data: string) => {
        messageQueue.push(data);
        if (!processing) {
          // Precisamos fazer bind do "this" ou utilizar arrow functions para manter o contexto
          processQueue.call(this);
        }
      });
    } else if (activeSymbol !== symbolUpper) {
      // Se já existe um símbolo ativo via WS diferente: adicione o novo símbolo para polling
      this.pollingUpdateService.addSymbol(symbolUpper);
      client.emit('info', { message: `A moeda ${symbolUpper} será atualizada via polling.` });
    } else {
      this.logger.log(`Cliente ${client.id} já está atualizado via WS para ${symbolUpper}.`);
    }
  } catch (error) {
    this.logger.error(`Erro na subscrição: ${error.message}`);
    client.emit('error', { message: 'Erro interno na subscrição.' });
  }
}

}