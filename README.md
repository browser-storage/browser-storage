# browser-storage

>The tool is in deep alpha and is not intended for use in production.

[![Build Status](https://travis-ci.org/browser-storage/browser-storage.svg?branch=master)](https://travis-ci.org/browser-storage/browser-storage)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

browser-storage is a async tool for storing and managing data in a browser. browser-storage does not use third-party packages for its work.

## Packages

- [@browser-storage/index](https://github.com/browser-storage/browser-storage/tree/master/packages/index)
- [@browser-storage/localstorage-driver](https://github.com/browser-storage/browser-storage/tree/master/packages/localstorage-driver)
- [@browser-storage/sessionstorage-driver](https://github.com/browser-storage/browser-storage/tree/master/packages/sessionstorage-driver)
- [@browser-storage/websql-driver](https://github.com/browser-storage/browser-storage/tree/master/packages/websql-driver)
- [@browser-storage/indexeddb-driver](https://github.com/browser-storage/browser-storage/tree/master/packages/indexeddb-driver)

## Install

```sh
$ npm i @browser-storage/index @browser-storage/localstorage-driver @browser-storage/websql-driver

```

## Example

```typescript
import { BrowserStorage } from '@browser-storage/index';
import { LocalstorageDriver } from '@browser-storage/localstorage-driver';
import { WebsqlDriver } from '@browser-storage/websql-driver';

const storage = new BrowserStorage({
  name: 'myDb',
  storeName: 'myStore',
  version: 1,
  drivers: [
    new WebsqlDriver({description: 'My first store', size: 2 * 1024 * 1024}),
    new LocalstorageDriver() // fallback, if websql is not supported
  ]
});

storage.setItem('a', 'b');

storage.getItem('a').then(console.log);

```
