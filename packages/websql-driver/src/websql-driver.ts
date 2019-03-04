import { BrowserStorageOptions, Driver } from '@browser-storage/typings';
import { WebsqlSerializer } from './websql-serializer';
import { Defer } from "@browser-storage/core";

export interface WebsqlDriverOptions {
  description?: string;
  size: number;
}

export class WebsqlDriver implements Driver {
  private readonly _serializer: WebsqlSerializer = new WebsqlSerializer();
  private readonly description: string | undefined;
  private readonly size: number;
  private readonly _ready: Defer<boolean> = new Defer<boolean>();
  private options: BrowserStorageOptions;
  private db: Database;

  constructor({ description, size }: WebsqlDriverOptions) {
    this.description = description;
    this.size = size;
  }

  public get isSupported(): boolean {
    return typeof window.openDatabase === 'function';
  }

  public async clear(): Promise<void> {
    await this._executeSql(`DELETE FROM ${this.options.storeName}`);
  }

  public async destroy(): Promise<void> {
  }

  public async getItem<T>(key: string): Promise<T> {
    const result = await this._executeSql(`SELECT * FROM ${this.options.storeName} WHERE key = ? LIMIT 1`, [key]);
    return this._serializer.deserialize<T>(result.rows.item(0).value);
  }

  public async hasItem(key: string): Promise<boolean> {
    return (await this.keys()).indexOf(key) > -1;
  }

  public async init(dbOptions: BrowserStorageOptions): Promise<void> {
    this.options = dbOptions;
    this.db = this._createDB();

    await this._executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.options.storeName} (id INTEGER PRIMARY KEY, key unique, value)`
    );

    this._ready.resolve(true);
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
    const result = await this._executeSql(`SELECT key FROM ${this.options.storeName} as a order by id`);
    const keys: string[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      keys.push(result.rows.item(i).key);
    }

    return keys;
  }

  public async length(): Promise<number> {
    const result = await this._executeSql(`SELECT COUNT(key) as count FROM ${this.options.storeName}`);
    return result.rows.item(0).count;
  }

  public ready(): Promise<boolean> {
    return this._ready.promise;
  }

  public async removeItem(key: string): Promise<void> {
    await this._executeSql(`DELETE FROM ${this.options.storeName} WHERE key = ?`, [key]);
  }

  public async setItem<T>(key: string, item: T): Promise<T> {
    await this._executeSql(
      `INSERT OR REPLACE INTO ${this.options.storeName} (key, value) VALUES (?, ?)`,
      [key, await this._serializer.serialize(item)]);

    return item;
  }

  public async _transaction(): Promise<SQLTransaction> {
    return new Promise<SQLTransaction>((resolve, reject) => {
      this.db.transaction(tx => {
        resolve(tx);
      }, reject);
    });
  }

  public async _executeSql(sql: string, args: Array<string | number> = []): Promise<SQLResultSet> {
    const tx = await this._transaction();
    return new Promise<SQLResultSet>((resolve, reject) => {
      tx.executeSql(sql, args,
        (t, result: SQLResultSet) => resolve(result),
        (t, error) => {
          reject(error);
          return true;
        }
      );
    });
  }

  private _createDB(): Database {
    return window.openDatabase(this.options.name, this.options.version.toString(), this.description || '', this.size);
  }
}
