// src/crypto/coin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Coin } from '../entities/coin.entity';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
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
}
