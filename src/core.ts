import { PROCESS_DATA } from './data';
import { CREATE_PROCESS_ERROR } from './error';
import { PROCESS_HEADERS } from './headers';
import * as globalOptions from './options';
import { CREATE_PROCESS_RESPONSE } from './response';
import { PROCESS_URL } from './url';

export type DataType = RequestInit['body'] | Record<string, unknown>;
export interface FetchOptions extends Omit<RequestInit, 'headers'> {
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

export interface CreatedFetch {
  (url: string, options?: FetchOptions): Promise<FetchResponse>;

  /**
   * Global options
   */
  options: typeof globalOptions;
}

const createFetch = (): CreatedFetch => {
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
  ): FetchOptions => {
    const processedHeaders = PROCESS_HEADERS(headers);
    const processedData = PROCESS_DATA({ data, headers: processedHeaders });
    const processedURL = PROCESS_URL(url ?? requestURL, {
      param,
      isEncode,
    });

    const fetchTimeout = timeout ?? globalOptions.get('timeout') ?? 3000;

    return {
      method,
      headers: processedHeaders,
      body: processedData,
      url: processedURL,
      timeout: fetchTimeout,
      ...args,
    };
  };

  const performFetch = (options: FetchOptions): Promise<FetchResponse> => {
    const abort = new AbortController();
    const signal = abort.signal;
    const timer = setTimeout(() => abort.abort(), options.timeout);
    const processResponse = CREATE_PROCESS_RESPONSE(options);
    const processError = CREATE_PROCESS_ERROR(options);
    const processFinally = (): void => {
      timer.unref?.();
      clearTimeout(timer);
    };

    return fetch(options.url!, { signal, ...options })
      .then(processResponse)
      .catch(processError)
      .finally(processFinally);
  };

  const createdFetch = (
    url: string,
    options: FetchOptions = {},
  ): Promise<FetchResponse> => {
    const createdFetchOptions = createFetchOptions(url, options);

    return performFetch(createdFetchOptions);
  };

  createdFetch.options = globalOptions;

  return createdFetch;
};

export const EI = createFetch();
