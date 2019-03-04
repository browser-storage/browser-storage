import { BrowserStorageOptions, Driver } from '@browser-storage/typings';
import { Deffer } from "@browser-storage/core";

export class IndexeddbDriver implements Driver {
  private _options: BrowserStorageOptions;
  private _db: IDBDatabase;
  private readonly _ready: Deffer<boolean> = new Deffer<boolean>();

  public get isSupported() {
    return typeof window.indexedDB !== 'undefined';
  }

  public clear(): Promise<void> {
    const objectStore = this._getObjectStore('readwrite');
    return this._getRequestResult(objectStore.clear());
  }

  public async destroy(): Promise<void> {
  }

  public async getItem<T>(key: string): Promise<T> {
    const objectStore = this._getObjectStore('readonly');

    return this._getRequestResult<T>(objectStore.get(key));
  }

  public async hasItem(key: string): Promise<boolean> {
    const store = this._getObjectStore('readonly');

    return (await this._getRequestResult(store.count(key))) > 0;
  }

  public async init(dbOptions: BrowserStorageOptions): Promise<void> {
    this._options = dbOptions;

    this._db = await new Promise<IDBDatabase>((resolve, reject) => {
      const openRequest = window.indexedDB.open(this._options.name, this._options.version);

      openRequest.onerror = reject;
      openRequest.onsuccess = () => resolve(openRequest.result);
      openRequest.onupgradeneeded = (e) => {
        openRequest.result.createObjectStore(this._options.storeName);
      };
    });

    this._ready.resolve(true);
    return undefined;
  }

  public async iterate<T>(iterator: (key: string, value: T, index: number) => any): Promise<void> {
    const keys = await this.keys();

    return keys.reduceRight(async (prev, key, index) => {
      await prev;
      const value = await this.getItem<T>(key);
      await iterator(key, value, index);
    }, Promise.resolve());
  }

  public async key(index: number): Promise<string> {
    return (await this.keys())[index];
  }

  public async keys(): Promise<string[]> {
    const objectStore = this._getObjectStore('readonly');
    return this._getRequestResult<string[]>(objectStore.getAllKeys());
  }

  public async length(): Promise<number> {
    const objectStore = this._getObjectStore('readwrite');
    return this._getRequestResult<number>(objectStore.count());
  }

  public ready(): Promise<boolean> {
    return this._ready.promise;
  }

  public async removeItem(key: string): Promise<void> {
    await this._getRequestResult(this._getObjectStore('readwrite').delete(key));
  }

  public async setItem<T>(key: string, item: T): Promise<T> {
    const objectStore = this._getObjectStore('readwrite');
    await this._getRequestResult(objectStore.put(item, key));
    return item;
  }

  private _getObjectStore(mode: IDBTransactionMode) {
    return this._db
      .transaction([this._options.storeName], mode)
      .objectStore(this._options.storeName);
  }

  private _getRequestResult<T>(request: IDBRequest): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
  }
}
