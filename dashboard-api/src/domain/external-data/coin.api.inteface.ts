import { CoinListResponseDto } from "./dto/coin-list-response.dto";

export interface ICoinApi {
    /**
     * Obtém o valor atual da criptomoeda em USD.
     *
     * @param crypto O código da criptomoeda (ex: 'BTC', 'ETH')
     * @returns O valor da criptomoeda em USD.
     */
    getCryptoValue(crypto: string): Promise<number>;

    /**
     * Obtém lista de criptomoeda disponiveis.
     *
     * 
     * @returns lista de criptomoeda disponiveis.
     */
    fetchCoinList(): Promise<CoinListResponseDto>;
}