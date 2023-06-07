import type { FetchOption } from '../core/ei';

export interface ProcessDataOption extends Pick<FetchOption, 'data'> {
  /**
   * Custom request headers
   */
  header: Record<string, string>;
}
