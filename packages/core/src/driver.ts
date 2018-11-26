import { BrowserStorageOptions } from './browser-storage-options';

export interface Driver {
  isSupported: boolean;

  ready(): Promise<boolean>;

  init(dbOptions: BrowserStorageOptions): Promise<this>;

  getItem<T>(key: string): Promise<T>;

  hasItem(key: string): Promise<boolean>;

  iterate<T>(iterator: (key: string, value: T, index: number) => any): Promise<void>;

  key(index: number): Promise<string>;

  keys(): Promise<string[]>;

  length(): Promise<number>;

  removeItem(key: string): Promise<void>;

  setItem<T>(key: string, item: T): Promise<T>;

  clear(): Promise<void>;
}
