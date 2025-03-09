import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common'
import { CoinService } from '../services/coin.service';
import { JwtAuthGuard } from 'src/domain/auth/jwt-auth.guard';
import { StandardResponseDto } from 'src/domain/shared/dto/response/standard-response.dto';
import { CoinInfoDto } from '../dto/response/coin-info.dto';
import { CoinValueInfo } from '../dto/response/coin-value-info.dto';


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

  @UseGuards(JwtAuthGuard)
  @Get('add/:symbol')
  async addSymbolToUser(
    @Param('symbol') symbol: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const cryptoInfo = await this.coinService.getCryptoInfo(userId, symbol);
    return cryptoInfo;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboardCoins(@Request() req): Promise<StandardResponseDto<CoinValueInfo>> {
    const userId = req.user.userId; // obtém o userId do token JWT
    const coinValueInfos = await this.coinService.getDashboardCoins(userId);
    return new StandardResponseDto<CoinValueInfo>(
      true,
      'Lista de moedas obtida com sucesso para o dashboard!',
      coinValueInfos,
    );
  }
}