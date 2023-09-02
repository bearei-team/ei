import { FetchOptions } from '@/core';

export type Options = Partial<
  Pick<FetchOptions, 'headers' | 'timeout' | 'baseURL'>
>;

export type Store = Map<keyof Options, Options[keyof Options]>;
export interface OptionsStore {
  clear: () => void;
  set: <K extends keyof Options>(key: K, value: Options[K]) => Store;
  get: <K extends keyof Options>(key: K) => Options[K] | undefined;
}

const createOptionsStore = (): OptionsStore => {
  const store: Store = new Map();
  const clear = (): void => store.clear();
  const set = <K extends keyof Options>(key: K, value: Options[K]): Store =>
    store.set(key, value);

  const get = <K extends keyof Options>(key: K): Options[K] | undefined =>
    store.get(key) as Options[K];

  return { clear, set, get };
};

export const OPTIONS_STORE = createOptionsStore();
