import { BrowserStorageEvent } from './browser-storage-event';
import { BrowserStorageOptions } from './browser-storage-options';
import { Driver } from './driver';

function whenReady(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original: Function = descriptor.value;

  descriptor.value = async function value(...args) {
    await this.ready();

    return original.apply(this, args);
  };
}

export const EVENT_KEY = '__browser_storage_event_';

export type HandlerFn = (event: BrowserStorageEvent) => any;

export class BrowserStorage implements Driver {
  private readonly _driver: Driver;
  private readonly options: BrowserStorageOptions;
  private _handlerStore = new Set<HandlerFn>();

  constructor(options: BrowserStorageOptions) {
    this._driver = (Array.isArray(options.drivers)
      ? options.drivers : [options.drivers])
      .find(driver => driver.isSupported);

    this.options = {
      ...options,
      drivers: undefined
    };

    this.init(options);
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
    const oldValue = await this.hasItem(key)
      ? await this.getItem(key)
      : undefined;

    await this._driver.setItem<T>(key, item);

    const event = new BrowserStorageEvent({
      name: this.options.name,
      storeName: this.options.storeName,
      version: this.options.version,
      key,
      oldValue,
      newValue: item
    });

    this._applyHandlers(event);
    if (this.options.crossTabNotification) {
      this._triggerCrossTabEvent(event);
    }

    return item;
  }

  public init(dbOptions?: BrowserStorageOptions): Promise<void> {
    this._initCrossTabNotification();
    return !!this._driver && this._driver.init(dbOptions);
  }

  @whenReady
  public async hasItem(key: string): Promise<boolean> {
    return this._driver.hasItem(key);
  }

  @whenReady
  public async getDriver() {
    return this._driver;
  }

  public async destroy(): Promise<void> {
    window.removeEventListener('storage', this._storageChange);
    this._handlerStore.clear();
    return this._driver.destroy();
  }

  public addEventListener(fn: HandlerFn) {
    this._handlerStore.add(fn);
  }

  public removeEventListener(fn: HandlerFn) {
    this._handlerStore.delete(fn);
  }

  private _triggerCrossTabEvent(event: BrowserStorageEvent) {
    localStorage.setItem(EVENT_KEY, BrowserStorageEvent.serialize(event));
  }

  private _storageChange = (evt: StorageEvent) => {
    if (evt.key !== EVENT_KEY) {
      return;
    }

    const serializeEvent = localStorage.getItem(EVENT_KEY);
    const event = BrowserStorageEvent.deserialize(serializeEvent);

    if (event.name !== this.options.name || event.storeName !== this.options.storeName) {
      return;
    }

    this._applyHandlers(event);
  };

  private _applyHandlers(event: BrowserStorageEvent) {
    this._handlerStore.forEach(fn => fn(event));
  }

  private _initCrossTabNotification() {
    window.addEventListener('storage', this._storageChange);
  }
}
