import { FetchOptions } from '@/core';
import { ResponseErrorOptions } from './responseError';

export interface HTTPErrorOptions extends ResponseErrorOptions {
  request: Request;
}

export class HTTPError extends Error {
  readonly response: Response;
  readonly request: Request;
  readonly options: FetchOptions;

  constructor({ response, request, options }: HTTPErrorOptions) {
    const code =
      response.status || response.status === 0 ? response.status : '';

    const statusText = response.statusText || '';
    const statusCode = `${code} ${statusText}`.trim();
    const reason = statusCode ? `status code ${statusCode}` : 'Unknown error';

    super(`Request failed with ${reason}`);

    this.name = 'HTTPError';
    this.response = response;
    this.request = request;
    this.options = options;
  }
}
