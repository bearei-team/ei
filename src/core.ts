import { DATA } from './data';
import { ERROR } from './error';
import { HEADERS } from './headers';
import { OPTIONS_STORE } from './optionsStore';
import { RESPONSE } from './response';
import { CREATED_URL } from './url';

export type SearchType = number | string | boolean;
export type DataInit = RequestInit['body'] | Record<string, unknown>;
export interface FetchOptions extends RequestInit {
  /**
   * HTTP request methods supported include 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS',
   * with the default being 'GET' request.
   */
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

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
   * This parameter will be ignored when using a complete URL in the request.
   */
  baseURL?: string;

  /**
   * The body of the HTTP request, which can be a BodyInit object, null, or an object.
   */
  data?: DataInit;

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

export interface ProcessedFetchOptions extends FetchOptions {
  /**
   * The complete URL address for the HTTP request or a request path, for example,
   * "/api". When using the request path as the request URL, the "baseURL" parameter must be set.
   */
  url: string;
}

export type PerformFetchOptions = ProcessedFetchOptions;
export interface EIFetch {
  (url: string, options?: FetchOptions): Promise<FetchResponse>;

  /**
   * Fetch request options store.
   */
  optionsStore: typeof optionsStore;
}

const optionsStore = OPTIONS_STORE;
const { processHeaders } = HEADERS;
const { processData } = DATA;
const { createProcessResponse } = RESPONSE;
const { processURL } = CREATED_URL;
const { createProcessError } = ERROR;
const processFetchOptions = (
  url: string,
  {
    method = 'GET',
    param,
    timeout,
    headers,
    data,
    body,
    isEncode,
    baseURL,
    ...args
  }: FetchOptions = {},
): ProcessedFetchOptions => {
  const fetchTimeout = timeout ?? optionsStore.get('timeout') ?? 3000;
  const processedHeaders = processHeaders(headers);
  const processedData = processData({
    data: data ?? body,
    contentType: processedHeaders['content-type'],
  });

  const processedURL = processURL(baseURL ? `${baseURL}${url}` : url, {
    param,
    isEncode,
  });

  return {
    method,
    headers: processedHeaders,
    body: processedData,
    url: processedURL,
    timeout: fetchTimeout,
    ...args,
  };
};

const performFetch = async ({
  url,
  timeout,
  ...args
}: PerformFetchOptions): Promise<FetchResponse> => {
  const abort = new AbortController();
  const signal = abort.signal;
  const timer = setTimeout(() => abort.abort('Request Timeout'), timeout);
  const request = new Request(url, { signal, ...args });
  const responseOptions = { request, url, timeout, ...args };
  const processResponse = createProcessResponse(responseOptions);
  const processError = createProcessError(responseOptions);
  const processFinally = (): void => {
    /**
     * This method is a Node.js method used to unreference a RefCounted object.
     */
    timer.unref?.();
    clearTimeout(timer);
  };

  return fetch(request)
    .then(processResponse)
    .catch(processError)
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

  eiFetch.optionsStore = optionsStore;

  return eiFetch;
};

export const EI = createFetch();
