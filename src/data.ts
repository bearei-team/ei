import type { DataInit, FetchOptions } from '@/core';

export interface ProcessDataOptions extends Pick<FetchOptions, 'data'> {
  /**
   * The content type of the request, for example, "application/json; charset=utf-8".
   */
  contentType?: string;
}

export interface Data {
  processData: typeof processData;
}

const isJSONContent = (data: DataInit): boolean | undefined =>
  typeof data === 'object' && data !== null;

const processData = (data: DataInit): BodyInit =>
  isJSONContent(data) ? JSON.stringify(data) : (data as BodyInit);

const createData = (): Data => ({
  processData,
});

export const DATA = createData();
