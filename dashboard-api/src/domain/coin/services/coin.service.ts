// src/crypto/coin.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Coin } from '../entities/coin.entity';
import { Dashboard } from '../schemas/dashboard.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICoinApi } from 'src/domain/external-data/coin.api.inteface';
import { CoinValue } from '../schemas/coin-value.schema';
import { CoinValueInfo } from '../dto/response/coin-value-info.dto';
import { resolve } from 'path';
import { CoinValueInfoResponseDto } from 'src/domain/external-data/dto/coin-value-info-response.dto';
@Injectable()
export class CoinService {
  constructor(
    @InjectModel(Dashboard.name) private dashboardModel: Model<Dashboard>,
    @InjectModel(CoinValue.name) private coinModel: Model<CoinValue>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @Inject('ICoinApi')
    private readonly cryptoApiService: ICoinApi,
  ) {}

  /**
   * Retorna as moedas cujo símbolo inicia com o filtro informado.
   * Se nenhum filtro for fornecido, retorna todas as moedas.
   * Utiliza o operador SQL LIKE com '%' ao final da string.
   *
   * @param filter Parâmetro para busca parcial pelo símbolo.
   * @returns Uma lista de registros do tipo Coin.
   */
  async findCoins(filter: string): Promise<Coin[]> {
    const filterValue = filter ? `${filter}%` : '%';
    return this.coinRepository.find({
      where: {
        symbol: Like(filterValue),
      },
    });
  }
  
  async getCryptoInfo(userId: string, symbol: string): Promise<any> {
    const cryptoInfo = await this.cryptoApiService.getCryptoValue(symbol);
    console.log(cryptoInfo)
    if(!cryptoInfo.RAW || cryptoInfo.Message) throw new BadRequestException(cryptoInfo.Message) ;
    const usdData = cryptoInfo.RAW[symbol].USD;
    console.log(usdData)

    const coin = await this.upsertCoinValue(symbol, usdData.PRICE,usdData.OPENDAY);

    // Adiciona o símbolo da moeda à lista de moedas acompanhadas pelo usuário
    await this.dashboardModel.findOneAndUpdate(
      { userId },
      { $addToSet: { symbols: symbol } },
      { new: true, upsert: true },
    ).exec();
    const coinEntity = await this.coinRepository.findOneByOrFail({symbol});

  return CoinValueInfo.CoinValueBuilder(coinEntity, coin);
  }

/**
   * Busca ou atualiza o documento CoinValue no MongoDB.
   * @param symbol Símbolo da moeda.
   * @param price Preço atual.
   * @param openDay Preço de abertura do dia.
   * @returns Documento CoinValue atualizado.
   */
async upsertCoinValue(symbol: string, price?: number, openDay?: number): Promise<CoinValue> {
  let coinValue = await this.coinModel.findOne({ symbol }).exec();
  if (!coinValue) {
    coinValue = new this.coinModel(); // Cria um novo documento se não existir
    coinValue.symbol = symbol;
  } 

  if (openDay !== undefined && coinValue.openDay !== openDay) {
    coinValue.openDay = openDay;
  }
  if (price !== undefined && coinValue.price !== price) {
    coinValue.price = price;
  }
  coinValue.percentDifference = this.calculatePercentDifference(coinValue)
  await coinValue.save();
  return coinValue;
}


   /**
   * Calcula a variação percentual entre o preço atual e o preço de abertura.
   * @param currentPrice Preço atual da moeda.
   * @returns A variação percentual.
   */
  private calculatePercentDifference(coin: CoinValue): number {
    if (!coin.openDay || coin.openDay === 0) {
      return 0;
    }
    return ((coin.price - coin.openDay) / coin.openDay) * 100;
  }
  /**
   * Método que consulta o dashboard do usuário, obtém a lista de símbolos,
   * faz uma única chamada externa passando todos os símbolos e retorna uma lista de CoinValueInfo.
   */
async getDashboardCoins(userId: string): Promise<CoinValueInfo[]> {
  // 1. Obtém o documento Dashboard para o usuário
  const dashboard = await this.dashboardModel.findOne({ userId }).exec();
  if (!dashboard || !dashboard.symbols || dashboard.symbols.length === 0) {
    return []; // Se não houver nenhum símbolo, retorna uma lista vazia
  }

  // 2. Cria uma string separada por vírgulas (exemplo: "BTC,BNB,ETH")
  const symbolsList = dashboard.symbols.join(',');

  // 3. Consulta a API externa (a URL gerada será similar à do seu curl)
  const cryptoInfo = await this.cryptoApiService.getCryptoValue(symbolsList);
  if (!cryptoInfo.RAW) {
    throw new BadRequestException('Erro ao recuperar dados da API externa.');
  }

  // 4. Consulta a tabela de moedas de uma única vez usando o operador In
  const coins = await this.coinRepository.find({
    where: { symbol: In(dashboard.symbols) },
  });

  return this.mapToCoinValueInfos(coins, cryptoInfo);
}
private async mapToCoinValueInfos(coins: Coin[], cryptoInfo: CoinValueInfoResponseDto): Promise<CoinValueInfo[]> {
  if (!cryptoInfo.RAW) {
    throw new Error("Informações RAW não disponíveis na resposta da API externa.");
  }

  const coinValuePromises: Promise<CoinValueInfo | null>[] = coins.map(async (coin) => {
    if (!cryptoInfo.RAW)
      return null;
    const rawData = cryptoInfo.RAW[coin.symbol]?.USD;
    if (!rawData) {
      return null; // Retorna null se não houver dados RAW para a moeda
    }

    // Chama o método assíncrono para atualizar ou buscar a CoinValue
    const coinValue = await this.upsertCoinValue(coin.symbol, rawData.PRICE, rawData.OPENDAY);

    // Constrói o objeto CoinValueInfo e retorna
    return CoinValueInfo.CoinValueBuilder(coin, coinValue);
  });

  // Aguarda todas as Promises serem resolvidas
  const resolvedCoinValues = await Promise.all(coinValuePromises);

  // Filtra os resultados para remover valores nulos
  return resolvedCoinValues.filter((info): info is CoinValueInfo => info !== null);
}

}
