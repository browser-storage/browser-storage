export interface BrowserStorageEventOptions {
  name: string;
  storeName: string;
  version: number;
  key: string;
  oldValue: any;
  newValue: any;
  isCrossTab?: boolean;
}

export enum BrowserStorageEventTypes {
  Default,
  SetItem,
  RemoveItem,
  Clear
}

function getEventFromJSON(json): BrowserStorageEvents {
  switch (json.type) {
    case BrowserStorageEventTypes.Clear:
      return new ClearBrowserStorageEvent(json);
    case BrowserStorageEventTypes.SetItem:
      return new SetItemBrowserStorageEvent(json);
    case BrowserStorageEventTypes.RemoveItem:
      return new RemoveItemBrowserStorageEvent(json);
    default:
      return new BrowserStorageEvent(json);
  }
}

export class BrowserStorageEvent {
  public readonly name: string;
  public readonly storeName: string;
  public readonly version: number;
  public readonly key: string;
  public readonly oldValue;
  public readonly newValue;
  public isCrossTab: boolean;
  public type: BrowserStorageEventTypes = BrowserStorageEventTypes.Default;

  constructor({ name, storeName, version, key, oldValue, newValue, isCrossTab = false }: BrowserStorageEventOptions) {
    this.name = name;
    this.storeName = storeName;
    this.version = version;
    this.key = key;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.isCrossTab = isCrossTab;
  }

  public static deserialize(event: string): BrowserStorageEvents {
    const json = JSON.parse(event);
    return getEventFromJSON(json);
  }

  public static serialize(event: BrowserStorageEvent): string {
    return JSON.stringify(event);
  }

  public copyWith({
                    name = this.name,
                    storeName = this.storeName,
                    version = this.version,
                    key = this.key,
                    oldValue = this.oldValue,
                    newValue = this.newValue,
                    isCrossTab = this.isCrossTab
                  }: Partial<BrowserStorageEventOptions>): BrowserStorageEvents {

    return getEventFromJSON({
      type: this.type,
      name,
      storeName,
      version,
      key,
      oldValue,
      newValue,
      isCrossTab
    });
  }
}

export class SetItemBrowserStorageEvent extends BrowserStorageEvent {
  public type: BrowserStorageEventTypes = BrowserStorageEventTypes.SetItem;
}

export class RemoveItemBrowserStorageEvent extends BrowserStorageEvent {
  public type: BrowserStorageEventTypes = BrowserStorageEventTypes.RemoveItem;
}

export class ClearBrowserStorageEvent extends BrowserStorageEvent {
  public type: BrowserStorageEventTypes = BrowserStorageEventTypes.Clear;
}

export type BrowserStorageEvents =
  BrowserStorageEvent |
  SetItemBrowserStorageEvent |
  RemoveItemBrowserStorageEvent |
  ClearBrowserStorageEvent;
