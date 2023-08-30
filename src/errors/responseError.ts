import { FetchOptions } from '@/core';

export interface ResponseErrorOptions {
  response: Response;
  options: FetchOptions;
}

export class ResponseError extends Error {
  readonly response: Response;
  readonly options: FetchOptions;

  constructor({ response, options }: ResponseErrorOptions) {
    super('Request response failed');

    this.name = 'ResponseError';
    this.response = response;
    this.options = options;
  }
}
