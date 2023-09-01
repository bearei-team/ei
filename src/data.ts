import type { Data, FetchOptions } from '@/core';

export interface ProcessDataOptions extends Pick<FetchOptions, 'data'> {
  /**
   * The content type of the request, for example, "application/json; charset=utf-8".
   */
  contentType?: string;
}

const isJSONContent = (data: Data, contentType?: string): boolean | undefined =>
  typeof data === 'object' &&
  data !== null &&
  contentType?.startsWith('application/json');

export const PROCESS_DATA = ({ data, contentType }: ProcessDataOptions): Data =>
  isJSONContent(data, contentType) ? JSON.stringify(data) : data;
