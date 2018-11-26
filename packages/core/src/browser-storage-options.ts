import { Driver } from './driver';

export interface BrowserStorageOptions {
  name: string;
  storeName: string;
  version: number;
  drivers: Driver | Driver[];
}
