// shared/interfaces/pool.interface.ts
export interface IPoolService<K, V> {
    getConnection(key: K): V;
    releaseConnection(key: K): void;
  }
  