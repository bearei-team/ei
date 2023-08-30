import type { DataType, FetchOptions } from '@/core';

export interface ProcessDataOptions extends Pick<FetchOptions, 'data'> {
  /**
   * Custom request headers
   */
  headers: Record<string, string>;
}

const isJSONContent = (
  data: DataType,
  contentType?: string,
): boolean | undefined =>
  typeof data === 'object' &&
  data !== null &&
  contentType?.startsWith('application/json');

export const PROCESS_DATA = ({
  data,
  headers,
}: ProcessDataOptions): BodyInit | null =>
  (isJSONContent(data, headers['content-type'])
    ? JSON.stringify(data)
    : data) as BodyInit;
