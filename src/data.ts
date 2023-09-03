import type { DataInit } from '@/core';

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
