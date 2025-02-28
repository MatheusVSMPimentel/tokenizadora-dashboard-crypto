// src/crypto/coin-list.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinDto, CoinListResponseDto } from 'src/domain/external-data/dto/coin-list-response.dto';
import { CoinApiService } from 'src/integration/external-data/coin.api.service';
import { Repository } from 'typeorm';
import { Coin } from '../entities/coin.entity';

@Injectable()
export class CoinListService {
  private readonly logger = new Logger(CoinListService.name);

  constructor(
    private readonly cryptoApiService: CoinApiService,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  /**
   * Busca a lista de moedas via API externa e atualiza (ou insere) os dados no banco.
   */
  async updateCoinListInDatabase(): Promise<void> {
    this.logger.log('Atualizando a lista de moedas no banco de dados...');
    try {
      const coinListResponse: CoinListResponseDto = await this.cryptoApiService.fetchCoinList();

      if (coinListResponse && coinListResponse.Data) {
        // Itera sobre as chaves do payload recebido
        for (const key of Object.keys(coinListResponse.Data)) {
          const coinData = coinListResponse.Data[key];

          const coinDtoFromApi = CoinDto.fromApi(coinData);
          if(!coinDtoFromApi)
            continue;

          // Procura uma moeda existente com o mesmo símbolo (unique)
          const existingCoin = await this.coinRepository.findOne({
            where: { symbol: coinDtoFromApi.Symbol },
          });

          if (existingCoin && coinDtoFromApi.isDifferent(existingCoin)) {
            // Atualiza os dados da moeda existente
            this.coinRepository.merge(existingCoin, coinDtoFromApi.mapToCoinEntity());
            await this.coinRepository.save(existingCoin);
            this.logger.log(`Atualizando dados da moeda ${coinDtoFromApi.Symbol}...`);
          } else if (!existingCoin) {
            const newCoin = this.coinRepository.create(coinDtoFromApi.mapToCoinEntity());
            await this.coinRepository.save(newCoin);
            this.logger.log(`Inserida nova moeda: ${coinDtoFromApi.Symbol}.`);
          }
        }
        this.logger.log('Lista de moedas atualizada com sucesso.');
      }
    } catch (error) {
      this.logger.error('Erro ao atualizar a lista de moedas no banco:', error);
    }
  }
}
