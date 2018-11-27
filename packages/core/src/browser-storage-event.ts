export interface BrowserStorageEventOptions {
  name: string;
  storeName: string;
  version: number;
  key: string;
  oldValue: any;
  newValue: any;
}

export class BrowserStorageEvent {
  public readonly name: string;
  public readonly storeName: string;
  public readonly version: number;
  public readonly key: string;
  public readonly oldValue;
  public readonly newValue;

  constructor({ name, storeName, version, key, oldValue, newValue }: BrowserStorageEventOptions) {
    this.name = name;
    this.storeName = storeName;
    this.version = version;
    this.key = key;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }

  public static deserialize(event: string) {
    return new BrowserStorageEvent(JSON.parse(event));
  }

  public static serialize(event: BrowserStorageEvent) {
    return JSON.stringify(event);
  }
}