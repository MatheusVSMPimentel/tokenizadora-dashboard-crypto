// src/crypto/entities/coin.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert } from 'typeorm';
const {nanoid} = require("nanoid");

@Entity('coins')
export class Coin {
  @PrimaryColumn()
  id: string;

  // Campo único para o símbolo da moeda
  @Column({ type: 'varchar', length: 300, unique: true })
  symbol: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  externalId: string; // id retornado pela API

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  fullName: string;

  @BeforeInsert()
    generateId(){
      this.id = `dev_${nanoid()}`
  }
}