import { Coin } from "../../entities/coin.entity";

export class CoinInfoDto {
    symbol: string;
    imageUrl: string;
    fullName: string;
    
    /**
   * Mapeia uma instância da entidade Coin para uma instância de CoinInfoDto.
   * @param coin Entidade Coin que contém os dados.
   * @returns Uma instância de CoinInfoDto com os dados mapeados.
   */
  static fromEntity(coin: Coin): CoinInfoDto {
    const dto = new CoinInfoDto();
    dto.symbol = coin.symbol;
    dto.imageUrl = coin.imageUrl;
    dto.fullName = coin.fullName;
    return dto;
  }
}
 

export class CoinListResponseDto {
    Success: boolean;
    Message: string;
    Data: CoinInfoDto[];
    Count: number;
  }