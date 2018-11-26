import { BrowserStorage } from './browser-storage';
import { BrowserStorageOptions } from './browser-storage-options';
import { Driver } from './driver';

function makeOptions(drivers: BrowserStorageOptions['drivers']): BrowserStorageOptions {
  return {
    name: 'testName',
    storeName: 'testStoreName',
    version: 1,
    drivers
  };
}

class SupportedDriver implements Driver {
  public isSupported: boolean = true;

  public clear(): Promise<void> {
    return undefined;
  }

  public getItem<T>(key: string): Promise<T> {
    return undefined;
  }

  public hasItem(key: string): Promise<boolean> {
    return undefined;
  }

  public init(dbOptions: BrowserStorageOptions): Promise<this> {
    return undefined;
  }

  public iterate<T>(iterator: (key: string, value: T, index: number) => any): Promise<void> {
    return undefined;
  }

  public key(index: number): Promise<string> {
    return undefined;
  }

  public keys(): Promise<string[]> {
    return undefined;
  }

  public length(): Promise<number> {
    return undefined;
  }

  public ready(): Promise<boolean> {
    return undefined;
  }

  public removeItem(key: string): Promise<void> {
    return undefined;
  }

  public setItem<T>(key: string, item: T): Promise<T> {
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
});
