// src/crypto/dto/coin-list-response.dto.ts

import { Coin } from "src/domain/coin/entities/coin.entity";


export class CoinDto {
    Id: string;
    ImageUrl: string;
    Symbol: string;
    FullName: string;
    
    /**
    * Cria uma instância de CoinDto a partir dos dados da API.
    * @param apiData Dados vindos da API externa.
    * @returns CoinDto já populado.
    */
  static fromApi(apiData: Partial<CoinDto>): CoinDto | null {
    if(!apiData.FullName || !apiData.Symbol || !apiData.Id ) return null;
    const instance = new CoinDto();
    instance.Id = apiData.Id;
    instance.ImageUrl = apiData.ImageUrl ?? "";
    instance.Symbol = apiData.Symbol;
    instance.FullName = apiData.FullName;
    return instance;
  }

  /**
   * Mapeia os dados deste DTO para uma entidade Coin.
   * @returns Uma instância da entidade Coin.
   */
  mapToCoinEntity(): Coin {
    const coin = new Coin();
    coin.externalId = this.Id;
    coin.imageUrl = this.ImageUrl;
    coin.symbol = this.Symbol;
    coin.fullName = this.FullName;
    return coin;
  }

  /**
   * Compara os dados deste DTO com os dados da entidade Coin.
   * Retorna true se houver alguma diferença relevante.
   */
  isDifferent(entity: Coin): boolean {
    return this.Id != entity.externalId ||
           this.ImageUrl != entity.imageUrl ||
           this.FullName != entity.fullName;
    }
  }
  
  export class CoinListResponseDto {
    Response: string;
    Message: string;
    Data: Record<string, CoinDto>;
    RateLimit: any;
    HasWarning: boolean;
    Type: number;
  }
  