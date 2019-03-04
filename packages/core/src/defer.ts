export class Defer<T> {
  private _resolve: (result: T) => any;
  private _reject: (result: T) => any;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._reject = reject;
      this._resolve = resolve;
    });
  }

  private readonly _promise: Promise<T>;

  public get promise(): Promise<T> {
    return this._promise;
  }

  public resolve(result: T) {
    return this._resolve(result);
  }

  public reject(result: T) {
    return this._reject(result);
  }
}
