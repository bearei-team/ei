import type { FetchOptions } from '@/core';

export type Options = Partial<
  Pick<FetchOptions, 'headers' | 'timeout' | 'baseUrl'>
>;

const optionsMap = new Map<string, unknown>();
const clear = (): void => optionsMap.clear();
const set = <K extends keyof Options>(key: K, value: Options[K]): void => {
  optionsMap.set(key, value);
};

const get = <K extends keyof Options>(key: K): Options[K] =>
  optionsMap.get(key) as Options[K];

export { clear, get, set };
