// src/crypto/crypto-data.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ICryptoData } from 'src/domain/external-data/coin.api.inteface';
import { CoinListResponseDto } from 'src/domain/external-data/dto/coin-list-response.dto';

@Injectable()
export class CoinApiService implements ICryptoData {

  constructor(private readonly httpService: HttpService) {}

  async getCryptoValue(crypto: string): Promise<number> {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${crypto.toUpperCase()}&tsyms=USD`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.USD;
    } catch (error) {
      console.error('Erro ao obter o valor da criptomoeda:', error);
      throw new HttpException('Erro ao buscar o valor da criptomoeda', 500);
    }
  }

  async fetchCoinList(): Promise<CoinListResponseDto> {
    const baseUrl = 'https://min-api.cryptocompare.com/data/all/coinlist';
    const params = {
      summary: true,
      api_key: '1d0301b5eb60baa4176f1c4a9ebdca828b1aeec339479f6d283e1f6a0e356c1b',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(baseUrl, {
          params,
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }),
      );
      return response.data as CoinListResponseDto;
    } catch (error) {
      throw new HttpException('Erro ao buscar a lista de moedas na API externa', 500);
    }
  }
}
