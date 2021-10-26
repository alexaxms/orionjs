export interface StoredCacheData {
  value: any
  expires?: Date
}

export interface SetCacheOptions {
  ttl?: number
  [key: string]: any
}

export interface CacheStore {
  /**
   * Save data in the cache
   */
  set(key: string, value: any, options: SetCacheOptions): Promise<void>

  /**
   * Get data from the cache
   */
  get(key: string): Promise<StoredCacheData>

  /**
   * Removes data from the cache
   */
  invalidate(key: string): Promise<void>
}