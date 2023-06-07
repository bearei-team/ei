import type { FetchOption } from '../core/ei';

export type ContentType = 'json' | 'text' | 'octetStream' | 'file';

export interface ProcessResponseOption extends FetchOption {
  /**
   * Custom request headers
   */
  header?: Record<string, string>;
}

export interface RequestResponse extends Pick<ProcessResponseOption, 'header'> {
  /**
   * The HTTP status code of the request response
   */
  status: number;

  /**
   * A textual description of the HTTP status code for the request response
   */
  statusText: string;

  /**
   * The server URL to use for the request
   */
  url: string;
}

export interface ProcessDataOption extends RequestResponse {
  option: FetchOption;
}
