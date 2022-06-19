class CustomCache {
  protected cacheMap: Map<string, any>;
  constructor() {
    this.cacheMap = new Map();
  }
  get(key: string) {
    return this.cacheMap.get(key);
  }
  set(key: string, value: any) {
    this.cacheMap.set(key, value);
  }
  has(key: string): boolean {
    return this.cacheMap.has(key);
  }
  del(key: string): boolean {
    return this.cacheMap.delete(key);
  }
  clear() {
    this.cacheMap.clear();
  }
}
const Cache = new CustomCache();
export default Cache;


// import Cache from '@lib/server/utils/cache';