import { PROCESS_DATA } from './data';
import { CREATE_PROCESS_ERROR } from './errors/error';
import { ResponseError } from './errors/responseError';
import { PROCESS_HEADERS } from './headers';
import * as globalOptions from './options';
import { CREATE_PROCESS_RESPONSE } from './response';
import { PROCESS_URL } from './url';

export type Data = RequestInit['body'] | Record<string, unknown>;
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
  data?: Data;

  /**
   * Whether to encode URL parameters. The default value is true
   */
  isEncode?: boolean;

  /**
   * Custom request headers
   */
  headers?: Record<string, string> | [string, string][];
}

export interface FetchResponse extends Pick<FetchOptions, 'headers'> {
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
  request: Request;
  response: Response;
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
      url: fetchURL,
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
    const processedData = PROCESS_DATA({
      data,
      contentType: processedHeaders['content-type'],
    });

    const processedURL = PROCESS_URL(url ?? fetchURL, { param, isEncode });
    const fetchTimeout = timeout ?? globalOptions.get('timeout') ?? 3000;

    return {
      method,
      headers: processedHeaders,
      body: processedData as BodyInit,
      url: processedURL,
      timeout: fetchTimeout,
      ...args,
    };
  };

  const performFetch = async (
    options: FetchOptions,
  ): Promise<FetchResponse> => {
    const abort = new AbortController();
    const signal = abort.signal;
    const timer = setTimeout(() => abort.abort(), options.timeout);
    const request = new Request(options.url!, { signal, ...options });
    const processResponse = CREATE_PROCESS_RESPONSE({ request, ...options });
    const processFinally = (): void => {
      timer.unref?.();
      clearTimeout(timer);
    };

    return fetch(request)
      .then(processResponse)
      .catch((error: ResponseError) => {
        const { response, options } = error;
        const processError = CREATE_PROCESS_ERROR({
          request,
          response,
          options,
        });

        return processError(error);
      })
      .finally(processFinally);
  };

  const createdFetch = (
    url: string,
    options: FetchOptions = {},
  ): Promise<FetchResponse> => {
    const fetchOptions = createFetchOptions(url, options);

    return performFetch(fetchOptions);
  };

  createdFetch.options = globalOptions;

  return createdFetch;
};

export const EI = createFetch();
