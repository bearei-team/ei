import type { FetchOption } from '../core/core.interface';

export interface ProcessDataOption extends Pick<FetchOption, 'data'> {
  /**
   * Custom request headers
   */
  header: Record<string, string>;
}
