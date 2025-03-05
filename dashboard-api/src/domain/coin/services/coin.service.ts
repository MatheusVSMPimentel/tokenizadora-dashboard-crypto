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

    let coin = await this.coinModel.findOne({ symbol });
    if (!coin) {
      coin = new this.coinModel();
      coin.symbol = symbol;
    }
    if(coin.openDay !== usdData.OPENDAY){
      coin.openDay = usdData.OPENDAY;
    }
    await coin.save();

    // Adiciona o símbolo da moeda à lista de moedas acompanhadas pelo usuário
    await this.dashboardModel.findOneAndUpdate(
      { userId },
      { $addToSet: { symbols: symbol } },
      { new: true, upsert: true },
    ).exec();
    const coinEntity = await this.coinRepository.findOneByOrFail({symbol});
    

    return CoinValueInfo.CoinValueBuilder
    (coinEntity, usdData.PRICE, this.percentualCryptoValueChange(usdData.PRICE, coin.openDay));
  }

  /**
 * Calcula a variação percentual entre o preço atual e o preço de abertura do dia.
 * @param precoAtual Preço atual da moeda.
 * @param precoAbertura Preço de abertura do dia.
 * @returns A variação percentual (positivo se houve alta, negativo se houve baixa).
 * @throws Error se o preço de abertura for zero (para evitar divisão por zero).
 */
private percentualCryptoValueChange(currentPrice: number, openPrice: number): number {
  if (openPrice === 0) {
    throw new Error('Preço de abertura não pode ser zero.');
  }
  return ((currentPrice - openPrice) / openPrice) * 100;
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

  // 5. Mapeia cada moeda para um CoinValueInfo
  //    A resposta da API externa terá a chave RAW com cada símbolo disponível.
  const coinValueInfos: CoinValueInfo[] = coins.map((coin) => {
    if (!cryptoInfo.RAW)
      return null;
    const rawData = cryptoInfo.RAW[coin.symbol]?.USD;
    if (!rawData) {
      return null; 
    }
    const price = rawData.PRICE;
    const openDay = rawData.OPENDAY;
    const percentualChange = openDay === 0 ? 0 : ((price - openDay) / openDay) * 100;
    return CoinValueInfo.CoinValueBuilder(coin, price, percentualChange);
  }).filter(info => info !== null);

  return coinValueInfos;
}
}
