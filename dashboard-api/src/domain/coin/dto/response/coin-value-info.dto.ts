import { Coin } from "../../entities/coin.entity";
import { CoinValue } from "../../schemas/coin-value.schema";

export class CoinValueInfo{
    private constructor(){}
    name: string;
    symbol: string;
    imageUrl: string;
    price: number;
    percentualChange: number;


        /**
   * Mapeia uma instância da entidade Coin para uma instância de CoinValueInfo.
   * @param coin Coin que contém os dados.
   * @returns Uma instância de CoinInfoDto com os dados mapeados.
   */
  static CoinValueBuilder(coin: Coin, coinValue :CoinValue): CoinValueInfo {
    const dto = new CoinValueInfo();
    dto.symbol = coin.symbol;
    dto.imageUrl = coin.imageUrl;
    dto.name = coin.fullName;
    dto.price = coinValue.price;
    dto.percentualChange = coinValue.percentDifference;
    return dto;
  }
}