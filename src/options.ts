import type { FetchOptions } from '@/core';

export type Options = Partial<
  Pick<FetchOptions, 'headers' | 'timeout' | 'baseURL'>
>;

const optionsMap = new Map<string, unknown>();

export const set = (options: Options): void => {
  optionsMap.clear();
  Object.entries(options).forEach(([key, value]) => optionsMap.set(key, value));
};

export const get = (key: string): unknown => optionsMap.get(key);
