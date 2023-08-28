import type { FetchOptions } from '@/core';

export interface ProcessDataOptions extends Pick<FetchOptions, 'data'> {
  /**
   * Custom request headers
   */
  headers: Record<string, string>;
}

const isJSONContent = (
  data: unknown,
  contentType?: string,
): boolean | undefined =>
  typeof data === 'object' &&
  data !== null &&
  contentType?.startsWith('application/json');

export const processData = ({ data, headers }: ProcessDataOptions): unknown =>
  isJSONContent(data, headers['content-type']) ? JSON.stringify(data) : data;
