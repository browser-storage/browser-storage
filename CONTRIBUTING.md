# Contributing to browser-storage

> Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
> By participating in this project you agree to abide by its terms.

To get started with the repo:

```sh
$ git clone git@github.com:browser-storage/browser-storage.git
$ cd lerna
$ npm i
$ npx lerna bootstrap
```

### Run Tests

```sh
$ npm test

# watch for changes
$ npm test -- --watch

# For a specific file (e.g., in index/command/__tests__/command.test.js)
$ npm test -- --watch index/command
```

### Linting

```sh
$ npm run lint
```

### Coverage

```sh
$ npm test -- --coverage
