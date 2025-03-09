// shared/services/base-pool.service.ts
import { Logger } from '@nestjs/common';
import { IPoolService } from '../interfaces/pool.interface';

export abstract class BasePoolService<K, V> implements IPoolService<K, V> {
  protected readonly logger = new Logger(BasePoolService.name);
  protected pool: Map<K, V> = new Map();
  protected subscriptions: Map<K, number> = new Map();

  abstract createConnection(key: K): V;

  getConnection(key: K): V {
    if (this.pool.has(key)) {
      this.subscriptions.set(key, (this.subscriptions.get(key) || 0) + 1);
      this.logger.log(`Conexão reutilizada para: ${key}`);
      const getPoolOpenConnection = this.pool.get(key)
      if (getPoolOpenConnection !== undefined) {
        return getPoolOpenConnection;
      } else {
        throw new Error("Valor é undefined");
      }
      
    }

    const connection = this.createConnection(key);
    this.pool.set(key, connection);
    this.subscriptions.set(key, 1);
    this.logger.log(`Nova conexão criada para: ${key}`);
    return connection;
  }

  releaseConnection(key: K): void {
    try{
    if (this.subscriptions.has(key)) {
        
      const count = this.subscriptions.get(key) ;
        
      if (count && count - 1 === 0) {
        const connection = this.pool.get(key);
        if(!connection) return;
        this.closeConnection(connection); // Método para fechar a conexão
        this.pool.delete(key);
        this.subscriptions.delete(key);
        this.logger.log(`Conexão encerrada para: ${key}`);
      } else if(count) {
        this.subscriptions.set(key, count);
      } else {
        return
      }
    }
    }catch (e){
        console.log(e);
    }
  }

  protected abstract closeConnection(connection: V): void;
}
