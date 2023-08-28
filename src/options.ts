import type { FetchOptions } from '@/core';

export type Options = Partial<
  Pick<FetchOptions, 'headers' | 'timeout' | 'baseUrl'>
>;

const optionsMap = new Map<string, unknown>();

export const clear = (): void => optionsMap.clear();
export const set = <K extends keyof Options>(
  key: K,
  value: Options[K],
): void => {
  optionsMap.set(key, value);
};

export const get = <K extends keyof Options>(key: K): Options[K] =>
  optionsMap.get(key) as Options[K];
