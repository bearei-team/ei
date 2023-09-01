import { PROCESS_DATA } from './data';
import { CREATE_PROCESS_ERROR } from './errors/error';
import { ResponseError } from './errors/responseError';
import { PROCESS_HEADERS } from './headers';
import * as globalOptions from './options';
import { CREATE_PROCESS_RESPONSE } from './response';
import { PROCESS_URL } from './url';

export type SearchType = number | string | boolean;
export type Data = RequestInit['body'] | Record<string, unknown>;
export interface FetchOptions extends RequestInit {
  /**
   * HTTP request methods supported include 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS',
   * with the default being 'GET' request.
   */
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

  /**
   * The complete URL address for the HTTP request or a request path, for example,
   * "/api". When using the request path as the request URL, the "baseURL" parameter must be set.
   */
  url?: string;

  /**
   * HTTP request timeout duration, measured in milliseconds. The default timeout is 3000 milliseconds.
   */
  timeout?: number;

  /**
   * HTTP request query parameters. These parameters will be merged with the query parameters on the URL,
   * and if a parameter with the same key as the URL exists, it will override that parameter.
   */
  param?: Record<string, SearchType>;

  /**
   * The base URL for the HTTP request. When using a path, such as "/api," as the URL,
   * it will automatically combine with this base URL to form the complete request URL.
   * This parameter will be ignored when using a complete URL in the request
   */
  baseURL?: string;

  /**
   * The body of the HTTP request, which can be a BodyInit object, null, or an object.
   */
  data?: Data;

  /**
   * Whether to encode URL query parameters, default is true.
   */
  isEncode?: boolean;
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

export interface EIFetch {
  (url: string, options?: FetchOptions): Promise<FetchResponse>;

  /**
   * Global options.
   */
  options: typeof globalOptions;
}

const processFetchOptions = (
  url: string,
  {
    url: fetchURL,
    method = 'GET',
    param,
    timeout,
    headers,
    data,
    body,
    isEncode,
    ...args
  }: FetchOptions = {},
): FetchOptions => {
  const processedHeaders = PROCESS_HEADERS(headers);
  const processedData = PROCESS_DATA({
    data: data ?? body,
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

const performFetch = async (options: FetchOptions): Promise<FetchResponse> => {
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

      return CREATE_PROCESS_ERROR({
        request,
        response,
        options,
      })(error);
    })
    .finally(processFinally);
};

const createFetch = (): EIFetch => {
  const eiFetch = (
    url: string,
    options: FetchOptions = {},
  ): Promise<FetchResponse> => {
    const fetchOptions = processFetchOptions(url, options);

    return performFetch(fetchOptions);
  };

  eiFetch.options = globalOptions;

  return eiFetch;
};

export const EI = createFetch();
