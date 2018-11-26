import { BrowserStorageOptions } from './browser-storage-options';
import { Driver } from './driver';

function whenReady(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original: Function = descriptor.value;

  descriptor.value = async function (...args) {
    await this.ready();

    return original.apply(this, args);
  };
}

export class BrowserStorage implements Driver {
  private readonly _driver: Driver;
  private readonly options: BrowserStorageOptions;

  constructor(options: BrowserStorageOptions) {
    this._driver = (Array.isArray(options.drivers)
      ? options.drivers : [options.drivers])
      .find(driver => driver.isSupported);
    if (this._driver) {
      this._driver.init(options);
    }

    this.options = {
      ...options,
      drivers: undefined
    };
  }

  public get isSupported(): boolean {
    return !!this._driver && this._driver.isSupported;
  }

  public async ready(): Promise<boolean> {
    return !!this._driver && this._driver.isSupported && this._driver.ready();
  }

  @whenReady
  public async clear(): Promise<void> {
    return this._driver.clear();
  }

  @whenReady
  public async getItem<T>(key: string): Promise<T> {
    return this._driver.getItem<T>(key);
  }

  @whenReady
  public async iterate<T>(iterator: (key: string, value: T, index: number) => any): Promise<void> {
    return this._driver.iterate<T>(iterator);
  }

  @whenReady
  public async key(index: number): Promise<string> {
    return this._driver.key(index);
  }

  @whenReady
  public async keys(): Promise<string[]> {
    return this._driver.keys();
  }

  @whenReady
  public async length(): Promise<number> {
    return this._driver.length();
  }

  @whenReady
  public async removeItem(key: string): Promise<void> {
    return this._driver.removeItem(key);
  }

  @whenReady
  public async setItem<T>(key: string, item: T): Promise<T> {
    return this._driver.setItem<T>(key, item);
  }

  public init(dbOptions?: BrowserStorageOptions): Promise<this> {
    return undefined;
  }

  @whenReady
  public async hasItem(key: string): Promise<boolean> {
    return this._driver.hasItem(key);
  }

  @whenReady
  public async getDriver() {
    return this._driver;
  }
}
