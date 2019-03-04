import { BrowserStorageOptions, Driver, Serializer } from '@browser-storage/typings';
import { SessionstorageSerializer } from './sessionstorage-serializer';
import { Deffer } from "@browser-storage/core";

export function makePrefix(options: BrowserStorageOptions) {
  return [options.name, options.storeName, options.version].filter(f => !!f).join('/') + '/';
}

export class SessionstorageDriver implements Driver {
  private options: BrowserStorageOptions;
  private readonly _ready: Deffer<boolean> = new Deffer<boolean>();

  constructor(private readonly serializer: Serializer = new SessionstorageSerializer) {
  }

  public get isSupported() {
    return typeof sessionStorage !== 'undefined';
  }

  private get prefix() {
    return makePrefix(this.options);
  }

  public async clear(): Promise<void> {
    return this.iterate(key => this.removeItem(key));
  }

  public async getItem<T>(key: string): Promise<T> {
    const result: string | null = sessionStorage
      .getItem(this.makeKey(key));

    return this.serializer.deserialize<T>(result);
  }

  public async setItem<T>(key: string, item: T): Promise<T> {
    const serializedItem = await this.serializer.serialize(item);
    sessionStorage.setItem(this.makeKey(key), serializedItem);
    return item;
  }

  public async iterate<T>(iterator: (key: string, value: T, index: number) => void): Promise<void> {
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
    const length = sessionStorage.length;
    const result = [];
    for (let i = 0; i < length; i++) {
      const key = sessionStorage.key(i) as string;
      if (this.includes(key)) {
        result.push(key.substring(this.prefix.length));
      }
    }

    return result;
  }

  public async length(): Promise<number> {
    return (await this.keys()).length;
  }

  public async removeItem(key: string): Promise<void> {
    sessionStorage.removeItem(this.makeKey(key));
  }

  public async init(options: BrowserStorageOptions): Promise<void> {
    this.options = options;
    this._ready.resolve(true);
  }

  public async ready(): Promise<boolean> {
    return this._ready.promise;
  }

  public async hasItem(key: string): Promise<boolean> {
    return (await this.keys()).indexOf(key) > -1;
  }

  private makeKey(key: string) {
    return this.prefix + key;
  }

  private includes(fullKey: string) {
    return fullKey.indexOf(this.prefix) === 0;
  }

  public async destroy(): Promise<void> {
    return undefined;
  }
}
