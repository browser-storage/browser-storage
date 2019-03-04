import { BrowserStorageOptions, Driver } from '@browser-storage/typings';
import { BrowserStorage, EVENT_KEY } from './browser-storage';
import { BrowserStorageEvent } from './browser-storage-event';

function makeOptions(drivers: BrowserStorageOptions['drivers'] = [], crossTabNotification?: BrowserStorageOptions['crossTabNotification']): BrowserStorageOptions {
  return {
    name: 'testName',
    storeName: 'testStoreName',
    version: 1,
    drivers,
    crossTabNotification
  };
}

class SupportedDriver implements Driver {
  public isSupported: boolean = true;

  public async clear(): Promise<void> {
    return undefined;
  }

  public async getItem<T>(key: string): Promise<T> {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  public async hasItem(key: string): Promise<boolean> {
    return localStorage.hasOwnProperty(key);
  }

  public async init(dbOptions: BrowserStorageOptions): Promise<void> {
    return undefined;
  }

  public async iterate<T>(iterator: (key: string, value: T, index: number) => any): Promise<void> {
    return undefined;
  }

  public async key(index: number): Promise<string> {
    return '';
  }

  public async keys(): Promise<string[]> {
    return [];
  }

  public async length(): Promise<number> {
    return 0;
  }

  public async ready(): Promise<boolean> {
    return true;
  }

  public async removeItem(key: string): Promise<void> {
    return undefined;
  }

  public async setItem<T>(key: string, item: T): Promise<T> {
    localStorage.setItem(key, JSON.stringify(item));
    return item;
  }

  public async destroy(): Promise<void> {
    return undefined;
  }
}

class UnsupportedDriver extends SupportedDriver {
  public isSupported = false;
}

describe('BrowserStorage', () => {

  test('#isSupported', async () => {
    const bs1 = new BrowserStorage(makeOptions([new SupportedDriver(), new UnsupportedDriver()]));
    const bs2 = new BrowserStorage(makeOptions([new UnsupportedDriver(), new SupportedDriver()]));
    const bs3 = new BrowserStorage(makeOptions(new UnsupportedDriver()));

    expect(bs1.isSupported).toBe(new SupportedDriver().isSupported);
    expect(bs1.isSupported).toBeTruthy();
    expect(bs2.isSupported).toBe(new SupportedDriver().isSupported);
    expect(bs3.isSupported).toBeFalsy();
  });

  test('#getDriver', async () => {
    const supportedDriver = new SupportedDriver();
    const unsupportedDriver = new UnsupportedDriver();
    const bs = new BrowserStorage(makeOptions([unsupportedDriver, supportedDriver]));

    expect(await bs.getDriver()).toEqual(supportedDriver);
  });

  test('#events', async () => {
    const supportedDriver = new SupportedDriver();
    const bs = new BrowserStorage(makeOptions(supportedDriver, true));
    const KEY = 'boolean';

    function handle1(event: BrowserStorageEvent) {
      const options = makeOptions();

      expect(event.name).toEqual(options.name);
      expect(event.storeName).toEqual(options.storeName);
      expect(event.version).toEqual(options.version);
      expect(event.key).toEqual(KEY);
      expect(event.oldValue).toBeUndefined();
      expect(event.newValue).toBeTruthy();
    }

    bs.addEventListener(handle1);

    await bs.setItem(KEY, true);
    bs.removeEventListener(handle1);

    function handle2(event: BrowserStorageEvent) {
      const options = makeOptions();

      expect(event.name).toEqual(options.name);
      expect(event.storeName).toEqual(options.storeName);
      expect(event.version).toEqual(options.version);
      expect(event.key).toEqual(KEY);
      expect(event.oldValue).toBeTruthy();
      expect(event.newValue).toBeFalsy();
    }

    bs.addEventListener(handle2);
    await bs.setItem(KEY, false);

    const fakeEvent = {
      key: EVENT_KEY,
      newValue: '',
      oldValue: '',
      storageArea: null,
      url: ''
    };
    await (bs as any)._storageChange(fakeEvent as StorageEvent);

    const otherEvent = {
      key: 'otherEvent',
      newValue: '',
      oldValue: '',
      storageArea: null,
      url: ''
    };
    await (bs as any)._storageChange(otherEvent as StorageEvent);

    await bs.destroy();
  });
});
