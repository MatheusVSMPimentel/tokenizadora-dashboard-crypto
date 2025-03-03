// src/crypto/crypto-data.service.ts
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CoinListResponseDto } from 'src/domain/external-data/dto/coin-list-response.dto';
import { ICoinApi } from 'src/domain/external-data/coin.api.inteface';
import { ConfigService } from '@nestjs/config';
import { CoinValueInfoResponseDto } from 'src/domain/external-data/dto/coin-value-info-response.dto';

@Injectable()
export class CoinApiService implements ICoinApi {

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  async getCryptoValue(crypto: string): Promise<CoinValueInfoResponseDto> {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto.toUpperCase()}&tsyms=USD`;
    try {
      const response = await firstValueFrom(this.httpService.get<CoinValueInfoResponseDto>(url));
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o valor da criptomoeda:', error);
      throw new HttpException('Erro ao buscar o valor da criptomoeda', 500);
    }
  }

  async fetchCoinList(): Promise<CoinListResponseDto> {
    const baseUrl = 'https://min-api.cryptocompare.com/data/all/coinlist';
    const params = {
      summary: true,
      api_key: this.configService.get<string>('API_KEY'),
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
