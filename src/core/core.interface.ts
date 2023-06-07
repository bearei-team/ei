export type DataType = RequestInit['body'] | unknown;

export interface FetchOption extends Omit<RequestInit, 'body' | 'headers'> {
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
  baseURL?: string;

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
  headers?: [string, string][] | Record<string, string>;
}
