import { processData } from './data';
import { processError } from './error';
import { processHeaders } from './headers';
import * as globalOptions from './options';
import { processResponse } from './response';
import { processURL } from './url';

export type DataType = RequestInit['body'] | Record<string, unknown>;
export interface FetchOptions extends Omit<RequestInit, 'body' | 'headers'> {
  /**
   * HTTP request method
   */
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

  /**
   * The server URL to use for the request
   */
  url?: string;

  /**
   * Specifies the number of milliseconds to timeout the request. The default value is 3000ms
   */
  timeout?: number;

  /**
   * URL parameters sent with the request, must be a simple object or a URLSearchParams object
   */
  param?: Record<string, number | string>;

  /**
   * Will be automatically prepended to `url`, except `url` is an absolute URL
   */
  baseUrl?: string;

  /**
   * The data to be sent as the request body
   */
  data?: DataType;

  /**
   * Whether to encode URL parameters. The default value is true
   */
  isEncode?: boolean;

  /**
   * Custom request headers
   */
  headers?: Record<string, string>;
}

export interface FetchResponse {
  options: FetchOptions;

  /**
   * Response data
   */
  data: unknown;

  /**
   * Response HTTP status code
   */
  status: number;

  /**
   * Response HTTP status code description
   */
  statusText: string;

  /**
   * URL of the initiated request
   */
  url: string;

  /**
   * Request headers of the initiated request
   */
  headers?: Record<string, string>;
}

export interface CreateFetchResult {
  (url: string, options?: FetchOptions): Promise<FetchResponse>;

  /**
   * Global options
   */
  options: typeof globalOptions;
}

const createFetch = (): CreateFetchResult => {
  const createFetchOptions = (
    url: string,
    {
      url: requestURL,
      method = 'GET',
      param,
      timeout,
      headers,
      data,
      isEncode,
      ...args
    }: FetchOptions = {},
  ) => {
    const processedHeaders = processHeaders(headers);
    const processedData = processData({ data, headers: processedHeaders });
    const processedURL = processURL(url ?? requestURL, { param, isEncode });
    const requestTimeout = timeout ?? globalOptions.get('timeout') ?? 3000;

    return {
      method,
      headers: processedHeaders,
      body: processedData,
      url: processedURL,
      timeout: requestTimeout,
      ...args,
    };
  };

  const performRequest = (options: FetchOptions): Promise<FetchResponse> => {
    const abort = new AbortController();
    const signal = abort.signal;
    const timer = setTimeout(() => abort.abort(), options.timeout);
    const performProcessResponse = processResponse(options);
    const performProcessError = processError(options);
    const processFinally = (): void => {
      timer.unref?.();
      clearTimeout(timer);
    };

    return fetch(options.url!, { signal, ...options })
      .then(performProcessResponse)
      .catch(performProcessError)
      .finally(processFinally);
  };

  const request = (
    url: string,
    options: FetchOptions = {},
  ): Promise<FetchResponse> => {
    const requestOptions = createFetchOptions(url, options);

    return performRequest(requestOptions);
  };

  request.options = globalOptions;

  return request;
};

export const ei = createFetch();
