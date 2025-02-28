import { Controller, Get, Query } from '@nestjs/common';
import { CoinService } from './services/coin.service';
import { CoinInfoDto } from './dto/response/coin-info.dto';
import { StandardResponseDto } from '../shared/dto/response/standard-response.dto';

@Controller('coins')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  /**
   * Endpoint GET que retorna os registros da tabela coins.
   * Se o parâmetro 'filter' for fornecido, utiliza a busca com operador LIKE.
   *
   * Exemplo: /coins?filter=BTC
   *
   * @param filter Valor parcial do símbolo da moeda
   * @returns Lista de moedas que satisfazem o filtro.
   */
  @Get()
  async getCoins(@Query('filter') filter: string): Promise<StandardResponseDto<CoinInfoDto>> {
    const coins = await this.coinService.findCoins(filter);
    const coinDtos = coins.map(CoinInfoDto.fromEntity);
  
    return new StandardResponseDto<CoinInfoDto>(
        true,
        'Lista de moedas obtida com sucesso!',
        coinDtos
      );
  }
}