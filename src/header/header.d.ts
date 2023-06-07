import type { FetchOption } from '../core/ei';

export type Headers = FetchOption['headers'];
export type Header = {
  'content-type'?: string;
  [key: string]: string;
};
