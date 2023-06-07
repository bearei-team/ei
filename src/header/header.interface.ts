import type { FetchOption } from '../core/core.interface';

export type Headers = FetchOption['headers'];
export type Header = {
  [key: string]: string;
};
