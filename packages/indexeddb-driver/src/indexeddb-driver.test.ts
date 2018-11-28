import { BrowserStorage } from '@browser-storage/core';
import { BrowserStorageOptions } from '@browser-storage/typings';
import { IndexeddbDriver } from './indexeddb-driver';

// @ts-ignore
window.indexedDB = require('fake-indexeddb');

let st: BrowserStorage;
const bsOptions: BrowserStorageOptions = {
  name: 'testName',
  storeName: 'testStoreName',
  version: 1,
  drivers: undefined
};

const NUMBER_VALUE = 123;
const NUMBER_KEY = 'NUMBER_KEY';

const BOOLEAN_VALUE = false;
const BOOLEAN_KEY = 'BOOLEAN_KEY';

const STRING_VALUE = 'STRING_VALUE';
const STRING_KEY = 'STRING_KEY';

const OBJECT_VALUE = {
  [BOOLEAN_KEY]: BOOLEAN_VALUE,
  [STRING_KEY]: STRING_VALUE,
  [NUMBER_KEY]: NUMBER_VALUE
};
const OBJECT_KEY = 'OBJECT_KEY';

const KEYS = [NUMBER_KEY, STRING_KEY, BOOLEAN_KEY, OBJECT_KEY];

beforeEach(() => {
  st = new BrowserStorage({ ...bsOptions, drivers: new IndexeddbDriver() });
});

describe('IndexeddbDriver', () => {
  test('#isSupported', async () => {
    const indexeddbDriver = new IndexeddbDriver();
    expect(indexeddbDriver.isSupported).toBe(true);
  });

  test('#ready', async () => {
    expect(await st.ready()).not.toBeFalsy();
    expect(await st.ready()).toBeTruthy();
  });

  test('#setItem', async () => {
    expect(await st.setItem(NUMBER_KEY, NUMBER_VALUE)).toEqual(NUMBER_VALUE);
    expect(await st.setItem(STRING_KEY, STRING_VALUE)).toEqual(STRING_VALUE);
    expect(await st.setItem(BOOLEAN_KEY, BOOLEAN_VALUE)).toEqual(BOOLEAN_VALUE);
    expect(await st.setItem(OBJECT_KEY, OBJECT_VALUE)).toEqual(OBJECT_VALUE);
  });

  test('#getItem', async () => {
    expect(await st.getItem(NUMBER_KEY)).toEqual(NUMBER_VALUE);
    expect(await st.getItem(STRING_KEY)).toEqual(STRING_VALUE);
    expect(await st.getItem(BOOLEAN_KEY)).toEqual(BOOLEAN_VALUE);
    expect(await st.getItem(OBJECT_KEY)).toEqual(OBJECT_VALUE);
  });

  test('#key', async () => {
    expect(await st.key(0)).toBeDefined();
  });

  test('#keys', async () => {
    beforeEach(async () => {
      await st.clear();

      await st.setItem(NUMBER_KEY, NUMBER_VALUE);
      await st.setItem(STRING_KEY, STRING_VALUE);
      await st.setItem(BOOLEAN_KEY, BOOLEAN_VALUE);
      await st.setItem(OBJECT_KEY, OBJECT_VALUE);
    });

    expect(await st.keys()).toHaveLength(KEYS.length);
  });

  test('#length', async () => {
    expect(await st.length()).toBe(KEYS.length);
  });

  test('#removeItem', async () => {
    expect(await st.hasItem(NUMBER_KEY)).toBeTruthy();
    await st.removeItem(NUMBER_KEY);
    expect(await st.hasItem(NUMBER_KEY)).toBeFalsy();
  });

  test('#cleare', async () => {
    await st.clear();
    expect(await st.keys()).toEqual([]);
  });

  test('#iterate', async () => {
    const result = {};

    await st.iterate(async (key, value, index) => {
      result[key] = value;
    });

    expect(result).toEqual({
      [BOOLEAN_KEY]: BOOLEAN_VALUE,
      [STRING_KEY]: STRING_VALUE,
      [OBJECT_KEY]: OBJECT_VALUE,
      [NUMBER_KEY]: NUMBER_VALUE
    });
  });
});
