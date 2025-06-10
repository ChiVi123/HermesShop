import { FulfilledHandler, RejectedHandler } from './types';

export class InterceptorManager<T> {
  private _handlers: (FulfilledHandler<T> | RejectedHandler)[];

  constructor() {
    this._handlers = [];
  }

  public get handlers(): (FulfilledHandler<T> | RejectedHandler)[] {
    return this._handlers;
  }

  public use(fulfilled: FulfilledHandler<T>, rejected: RejectedHandler): number {
    this._handlers.push(fulfilled, rejected);
    return this._handlers.length - 1;
  }
}
