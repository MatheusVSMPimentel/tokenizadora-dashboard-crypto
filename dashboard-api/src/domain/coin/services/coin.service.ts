// src/crypto/coin.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Coin } from '../entities/coin.entity';
import { Dashboard } from '../schemas/dashboard.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICoinApi } from 'src/domain/external-data/coin.api.inteface';
import { CoinValue } from '../schemas/coin-value.schema';

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
    const usdData = cryptoInfo.RAW[symbol].USD;

    let coin = await this.coinModel.findOne({ symbol });
    if (!coin) {
      coin = new this.coinModel();
    }
    coin.symbol = symbol;
    coin.openDay = usdData.OPENDAY;

    await coin.save();
    // Adiciona o símbolo da moeda à lista de moedas acompanhadas pelo usuário
    await this.dashboardModel.findOneAndUpdate(
      { userId },
      { $addToSet: { symbols: symbol } },
      { new: true, upsert: true },
    ).exec();

    return cryptoInfo;
  }
}
