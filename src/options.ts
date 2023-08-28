import type { FetchOptions } from '@/core';

export type Options = Partial<
  Pick<FetchOptions, 'headers' | 'timeout' | 'baseUrl'>
>;

const optionsMap = new Map<keyof Options, unknown>();

export const clear = (): void => optionsMap.clear();
export const set = (options: Options): void => {
  clear();
  Object.entries(options).forEach(([key, value]) =>
    optionsMap.set(key as keyof Options, value),
  );
};

export const get = (key: keyof Options): unknown => optionsMap.get(key);
